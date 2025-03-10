import StartScreen from "./components/StartScreen";
import "./App.css";
import { useCallback, useState, useEffect } from "react";
import GameOver from "./components/GameOver";
import Game from "./components/Game";
import { wordsList } from "./data/words";
import { use } from "react";
import Confetti from "react-confetti-boom";

const guessesQty = 3;

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
  const [letters, setLetters] = useState(["start"]);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);
  const [celebrate, setCelebrate] = useState(false);
  
  console.log(pickedWord)

  const handleCelebrate = () => {
    setCelebrate(true);
    setTimeout(() => {
      setCelebrate(false);
    }, 5000);
  };

  const pickWordAndCategory = useCallback(() => {
    const categories = Object.keys(words);
    const categorie =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];
    const word =
      words[categorie][Math.floor(Math.random() * words[categorie].length)];

    return { word, categorie };
  }, [words]);

  const startGame = useCallback(() => {
    clearLetterStates();
    const { word, categorie } = pickWordAndCategory();
    let wordLetters = word.split("");
    wordLetters = wordLetters.map((l) => l.toLowerCase());
    setPickedCategory(categorie);
    setPickedWord(word);
    setLetters(wordLetters);
    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }

    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);

      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };

  useEffect(() => {
    if (guesses <= 0) {
      clearLetterStates();
      setGameStage(stages[2].name);
    }
  }, [guesses]);

  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];
    if (guessedLetters.length == uniqueLetters.length) {
      setScore((actualScore) => (actualScore += 100));
      handleCelebrate();
      startGame();
    }
  }, [guessedLetters, letters, startGame]);

  const retry = () => {
    setGuesses(guessesQty);
    setScore(0);
    setGameStage(stages[0].name);
  };

  return (
    <div className="App">
      {celebrate && <Confetti shapeSize={40} mode="boom" particleCount={100}/>}
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === "end" && (
        <GameOver retry={retry} score={score} pickedWord={pickedWord} />
      )}
    </div>
  );
}

export default App;
