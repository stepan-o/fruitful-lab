import { fireEvent, render, screen } from "@testing-library/react";
import FactoryResetButton from "@/components/loopforge/FactoryResetButton";

test("a failed image after a responsive reload restores the labelled fallback without disabling reset",()=>{
  const onReset=jest.fn();
  const {container}=render(<FactoryResetButton jammed hintId="reset-hint" onReset={onReset}/>);
  const button=screen.getByRole("button",{name:"Restart conveyor"});
  const image=container.querySelector("img")!;
  fireEvent.load(image);
  expect(button).toHaveAttribute("data-art-ready","true");
  fireEvent.error(image);
  expect(button).toHaveAttribute("data-art-ready","false");
  expect(button).toHaveTextContent("PRESS TO RESET");
  fireEvent.click(button);
  expect(onReset).toHaveBeenCalledTimes(1);
});
