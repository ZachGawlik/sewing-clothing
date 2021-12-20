// Without this, Jest was failing from @emotion/react using React.createContext
// luckily, I truly don't care about styles for the tests I'm writing
export const css = () => undefined;
