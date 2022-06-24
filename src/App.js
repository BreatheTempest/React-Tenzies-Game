import Die from './Components/Die';
import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import Confetti from 'react-confetti';

export default function App() {
	const [currentScore, setCurrentScore] = useState({
		rolls: 0,
		time: 0,
	});

	const [topScore, setTopScore] = useState(
		JSON.parse(localStorage.getItem('topScore')) || {
			rolls: 0,
			time: 0,
		}
	);

	const [time, setTime] = useState({
		startTme: 0,
		endTime: 0,
	});

	function generateNewDie() {
		return {
			value: Math.floor(Math.random() * 6 + 1),
			isHeld: false,
			id: nanoid(),
		};
	}

	function allNewDice() {
		const diceArray = [];
		for (let i = 0; i < 10; i++) {
			diceArray.push(generateNewDie());
		}
		return diceArray;
	}

	const [dice, setDice] = useState(allNewDice());

	const diceElements = dice.map((die) => (
		<Die
			key={die.id}
			value={die.value}
			isHeld={die.isHeld}
			id={die.id}
			holdDice={holdDice}
		/>
	));

	function rollDice() {
		setDice((oldDice) =>
			oldDice.map((die) => {
				return die.isHeld ? die : generateNewDie();
			})
		);
		setCurrentScore((oldScore) => ({
			...oldScore,
			rolls: oldScore.rolls + 1,
		}));
	}

	function holdDice(id) {
		setDice((prevDice) =>
			prevDice.map((die) => ({
				...die,
				isHeld: die.id === id ? !die.isHeld : die.isHeld,
			}))
		);
	}

	const [tenzies, setTenzies] = useState(false);

	useEffect(() => {
		let checkDie = dice[0].value;
		for (let die of dice) {
			if (die.value === checkDie && die.isHeld) {
			} else return;
		}
		setTenzies(true);
	}, [dice]);

	function newGame() {
		setTenzies(false);
		setDice(allNewDice());
		setCurrentScore({
			rolls: 0,
			time: 0,
		});
	}

	useEffect(() => {
		if (
			currentScore.rolls !== 0 &&
			(topScore.rolls > currentScore.rolls || topScore.rolls === 0)
		)
			setTopScore((prevTopScore) => ({
				...prevTopScore,
				rolls: currentScore.rolls,
			}));
		localStorage.setItem('topScore', JSON.stringify(topScore));
	}, [tenzies]);

	return (
		<main>
			{tenzies ? <Confetti /> : ''}
			<h1>Tenzies</h1>
			<p className="rules">
				Roll until all dice are the same. Click each die to freeze it at its
				current value between rolls.
			</p>
			<div className="dice-container">{diceElements}</div>
			<button onClick={tenzies ? newGame : rollDice} className="roll">
				{tenzies ? 'New Game' : 'Roll'}
			</button>
			<div className="score">
				<div className="roll-score">
					<p>Current rolls: {currentScore.rolls}</p>
					<p>Top score: {topScore.rolls}</p>
				</div>
				<div className="time-score">
					<p>Current time: {currentScore.time}</p>
					<p>Top time: {topScore.time}</p>
				</div>
			</div>
		</main>
	);
}
