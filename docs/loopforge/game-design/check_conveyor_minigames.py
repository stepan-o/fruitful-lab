"""Check the Day 2 design examples. This is a calculation, independent of the game."""
from dataclasses import dataclass
from pathlib import Path
import re

SPEC = Path(__file__).resolve().parents[1] / "studio-briefs/day-2-conveyor-rules.md"
HZ = 20
TRANSFER = 10
BELL = 1723
STATIONS = ("Intake", "Wash", "Belt", "Forge")
STATS = ("Force", "Precision", "Timing")


def read_profiles(text, first_column):
    """Read the same numeric ratings that the owner sees in the design page."""
    rows = text.split("| " + first_column + " | Force |", 1)[1].splitlines()[2:]
    result = {}
    for line in rows:
        if not line.startswith("|"):
            break
        cells = [cell.strip() for cell in line.strip("|").split("|")]
        ratings = tuple(int(re.fullmatch(fr"{name} (\d)/5", cell)[1])
                        for name, cell in zip(STATS, cells[1:4]))
        result[cells[0]] = (ratings, *cells[4:])
    return result


def duration(station, team, workers, stations):
    needs, units = stations[station]
    fits = sorted((sum(a * b for a, b in zip(needs, workers[w][0])) for w in team),
                  reverse=True)
    rate = sum(fit * factor for fit, factor in zip(fits, (4, 2, 1)))
    return (int(units) + rate - 1) // rate


@dataclass
class Load:
    serial: int
    state: str
    due: int = 0


def regular(arrivals, workers, stations):
    # Relative ticks. C1 is already at Wash, and Intake can start the next brain.
    slots = [None, Load(1, "ready"), None, None]
    serial = 1
    rack = []
    trace = []
    for tick in range(BELL):
        for i in reversed(range(4)):
            load = slots[i]
            if load is None or load.state != "transfer" or load.due != tick:
                continue
            slots[i] = None
            if i == 3:
                rack.append(tick)
            else:
                slots[i + 1] = Load(load.serial, "ready")
        if slots[0] is None:
            serial += 1
            slots[0] = Load(serial, "ready")
        for i in reversed(range(4)):
            load = slots[i]
            if load is None or load.state == "transfer":
                continue
            worker, arrival = arrivals[i]
            if load.state == "ready" and tick >= arrival:
                load.state = "working"
                load.due = tick + duration(STATIONS[i], [worker], workers, stations)
            if load.state == "working" and load.due == tick:
                if load.serial == 1:
                    trace.append((STATIONS[i] + " finished", tick))
                load.state = "held"
            if load.state == "held":
                receiver_ready = i == 3 or (slots[i + 1] is None and
                                            (i == 0 or tick >= arrivals[i + 1][1]))
                if receiver_ready:
                    if load.serial == 1:
                        trace.append((STATIONS[i] + " released", tick))
                    load.state = "transfer"
                    load.due = tick + TRANSFER
    return rack, trace


def main():
    source = SPEC.read_text()
    workers = read_profiles(source, "Worker")
    stations = read_profiles(source, "Station")
    assert len(workers) == 10 and tuple(stations) == STATIONS
    for station, teams, expected in (
        ("Belt", (["jo"], ["jo", "kit"]), [73, 44]),
        ("Forge", (["max", "kit"], ["max"]), [35, 50]),
    ):
        times = [duration(station, team, workers, stations) for team in teams]
        assert times == expected
        print(station, "ticks before / after moving kit:", times)
    # Call, loaded stroke, rack transfer. Report time is relative to max's wait.
    for choice, tap in (("Immediate Clear", 0), ("Wait 2 s", 2 * HZ), ("Watch", None)):
        arrival = None if tap is None else tap + 10 + 40 + TRANSFER
        print(choice, "C2 arrival tick:", arrival)
    for route, wash, belt in (("Pass", 122, 305), ("Detention", BELL, 556)):
        rack, trace = regular([("sam", 0), ("bob", wash), ("jo", belt), ("max", 0)],
                              workers, stations)
        if route == "Pass":
            assert rack == list(range(458, 1668, 93))
            assert trace == [("Wash finished", 174), ("Wash released", 305),
                             ("Belt finished", 388), ("Belt released", 388),
                             ("Forge finished", 448), ("Forge released", 448)]
        else:
            assert not rack and not trace
        print(route, "C1 events:", trace)
        print(route, "rack arrival ticks:", rack, "total:", len(rack))


if __name__ == "__main__":
    main()
