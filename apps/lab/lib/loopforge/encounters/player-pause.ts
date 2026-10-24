/** User pause is independent of authored reading holds and never changes world time. */
export function togglePlayerPause(state:{userPaused?:boolean;playing:boolean;reading?:unknown}){
 state.userPaused=!state.userPaused;
 state.playing=!state.userPaused&&!state.reading;
 return state.playing;
}
