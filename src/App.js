import Die from './Components/Die';
import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import Confetti from 'react-confetti';

export default function App() {
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
	}

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
		</main>
	);
}
