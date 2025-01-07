import StartScreen from "./components/StartScreen";
import "./App.css";
import { useCallback, useState, useEffect } from "react";
import GameOver from "./components/GameOver";
import Game from "./components/Game";
import { wordsList } from "./data/words";
import { use } from "react";

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);
  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const pickWordAndCategory = () => {
    const categories = Object.keys(words);
    const categorie =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];
    const word =
      words[categorie][Math.floor(Math.random() * words[categorie].length)];

    return { word, categorie };
  };

  const startGame = () => {
    const { word, categorie } = pickWordAndCategory();
    let wordLetters = word.split("");
    wordLetters = wordLetters.map((l) => l.toLowerCase());
    setPickedCategory(categorie)
    setPickedWord(word)
    setLetters(letters) // i belive it should be "wordLetters"
    setGameStage(stages[1].name);
  };

  const verifyLetter = () => {
    setGameStage(stages[2].name); // Just a test
  };

  const retry = () => {
    setGameStage(stages[0].name);
  };

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && <Game verifyLetter={verifyLetter} />}
      {gameStage === "end" && <GameOver retry={retry} />}
    </div>
  );
}

export default App;
