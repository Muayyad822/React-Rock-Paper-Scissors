import  { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link
import "./App.css";

function App() {
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [trials, setTrials] = useState(Number(sessionStorage.getItem("trials")) || 0);
  const [wins, setWins] = useState(Number(sessionStorage.getItem("wins")) || 0);
  const [playerChoice, setPlayerChoice] = useState("");
  const [computerChoice, setComputerChoice] = useState("");
  const [result, setResult] = useState("");
  const [finalResult, setFinalResult] = useState("");
  const [gameActive, setGameActive] = useState(true);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [showInstructions, setShowInstructions] = useState(true);

  const choices = ["Rock", "Paper", "Scissors"];

  useEffect(() => {
    sessionStorage.setItem("trials", trials);
    sessionStorage.setItem("wins", wins);
  }, [trials, wins]);

  const playGame = (playerChoice) => {
    if (!gameActive) return;

    const computerChoice =
      currentLevel === 1
        ? choices[Math.floor(Math.random() * choices.length)]
        : getBiasedComputerChoice(playerChoice);

    const result = determineResult(playerChoice, computerChoice);

    setPlayerChoice(playerChoice);
    setComputerChoice(computerChoice);
    setResult(result);

    if (result === "YOU WIN") {
      setPlayerScore((prev) => prev + 1);
    } else if (result === "YOU LOSE") {
      setComputerScore((prev) => prev + 1);
    }

    checkGameEnd(playerScore + 1, computerScore + 1);
  };

  const determineResult = (playerChoice, computerChoice) => {
    if (playerChoice === computerChoice) return "IT'S A TIE";

    switch (playerChoice) {
      case "Rock":
        return computerChoice === "Scissors" ? "YOU WIN" : "YOU LOSE";
      case "Paper":
        return computerChoice === "Rock" ? "YOU WIN" : "YOU LOSE";
      case "Scissors":
        return computerChoice === "Paper" ? "YOU WIN" : "YOU LOSE";
      default:
        return "Invalid choice";
    }
  };

  const checkGameEnd = (playerScore, computerScore) => {
    if (playerScore === 5) {
      setFinalResult("You Won This Round");
      setWins((prev) => prev + 1);
      if (wins + 1 === 5) {
        setCurrentLevel(2);
        alert("Congratulations! You've advanced to Level 2.");
      }
      setGameActive(false);
    } else if (computerScore === 5) {
      setFinalResult("You Lost This Round");
      setGameActive(false);
    }
  };

  const resetGameState = () => {
    setPlayerScore(0);
    setComputerScore(0);
    setFinalResult("");
    setResult("");
    setGameActive(true);
    setTrials((prev) => prev + 1);
  };

  const getBiasedComputerChoice = (playerChoice) => {
    switch (playerChoice) {
      case "Rock":
        return Math.random() < 0.7 ? "Paper" : choices[Math.floor(Math.random() * 3)];
      case "Paper":
        return Math.random() < 0.7 ? "Scissors" : choices[Math.floor(Math.random() * 3)];
      case "Scissors":
        return Math.random() < 0.7 ? "Rock" : choices[Math.floor(Math.random() * 3)];
      default:
        return choices[Math.floor(Math.random() * 3)];
    }
  };

  return (
    <div className="App">
      {/* Instructions Modal */}
      {showInstructions && (
        <div className="instructionsModal">
          <h1>Welcome to Rock, Paper, Scissors!</h1>
          <p>Instructions:</p>
          <ul>
            <li>1. Click &quot;Rock,&quot; &quot;Paper,&quot; or &quot;Scissors&quot; to make your choice.</li>
            <li>2. The computer will also make a choice.</li>
            <li>3. Win a round by reaching 5 points before the computer.</li>
            <li>4. Win five rounds to unlock Level 2 with smarter computer choices.</li>
            <li>5. Click &quot;Play Again&quot; after a round to reset the game and start a new round.</li>
            <li>6. Your wins and trials are tracked and saved as long as you stay in this browser.</li>
          </ul>
          <div>
            <button onClick={() => setShowInstructions(false)}>Got It!</button>
            <Link to="/how-to">
              <button>How To Play</button>
            </Link>
          </div>
        </div>
      )}

      <h1>Rock Paper Scissors</h1>
      <div className="info">
        <div className="scoreDisplay">
          <p id="playerScore">Player: {playerScore}</p>
          <p id="computerScore">Computer: {computerScore}</p>
        </div>
        <div className="scoreDisplay">
          <p id="trialsDisplay">Trials: {trials}</p>
          <p id="winsDisplay">Wins: {wins}</p>
        </div>
      </div>
      <div className="choices">
        {choices.map((choice) => (
          <p key={choice} onClick={() => playGame(choice)}>
            {choice === "Rock" ? "👊" : choice === "Paper" ? "✋" : "✌"}
          </p>
        ))}
      </div>
      <div className="choiceDisplay">
        <p id="playerChoice">Player: {playerChoice}</p>
        <p id="computerChoice">Computer: {computerChoice}</p>
      </div>
      <p id="resultDisplay" className={result === "YOU WIN" ? "greenText" : result === "YOU LOSE" ? "redText" : ""}>
        {result}
      </p>
      <p id="finalResultDisplay">{finalResult}</p>
      <button id="replayBtn" onClick={resetGameState} style={{ display: gameActive ? "none" : "block" }}>
        Next Round
      </button>
    </div>
  );
}

export default App;