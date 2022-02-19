import {useEffect, useRef, useState} from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import words from './words';

const selectedWord = words[Math.floor(Math.random() * words.length)];

console.log(selectedWord)

const char = (c) => {
  return c?.toLocaleUpperCase('tr-TR')
}

const GuessedRow = ({winner, word, onWin}) => {
  const [status, setStatus] = useState([...new Array(5).map(() => 0)])

  useEffect(() => {
    let arr = [];

    if (winner && word) {
      if (winner === word) {
        setStatus([2, 2, 2, 2, 2]);
        onWin()
        return null;
      }

      arr = [...word.split('').map(w => winner.split('').includes(w))].map(x => x ? 1 : 0);

      word.split('').map((w, idx) => {
        if (winner.split('')[idx] === w) {
          arr[idx] = 2
        }
      })

      setStatus(arr)

    }
  }, [winner, word]);

  return (
    <div className="row">
      <div className={`col box ${status[0] === 2 && 'green'} ${status[0] === 1 && 'yellow'} ${status[0] === 0 && 'gray'}`}>{char(word[0])}</div>
      <div className={`col box ${status[1] === 2 && 'green'} ${status[1] === 1 && 'yellow'} ${status[1] === 0 && 'gray'}`}>{char(word[1])}</div>
      <div className={`col box ${status[2] === 2 && 'green'} ${status[2] === 1 && 'yellow'} ${status[2] === 0 && 'gray'}`}>{char(word[2])}</div>
      <div className={`col box ${status[3] === 2 && 'green'} ${status[3] === 1 && 'yellow'} ${status[3] === 0 && 'gray'}`}>{char(word[3])}</div>
      <div className={`col box ${status[4] === 2 && 'green'} ${status[4] === 1 && 'yellow'} ${status[4] === 0 && 'gray'}`}>{char(word[4])}</div>
    </div>
  )
}

const Row = ({word}) => {
  return (
    <div className="row">
      <div className={`col box ${word.length === 0 && 'has-letter'}`}>{char(word[0])}</div>
      <div className={`col box ${word.length === 1 && 'has-letter'}`}>{char(word[1])}</div>
      <div className={`col box ${word.length === 2 && 'has-letter'}`}>{char(word[2])}</div>
      <div className={`col box ${word.length === 3 && 'has-letter'}`}>{char(word[3])}</div>
      <div className={`col box ${word.length === 4 && 'has-letter'}`}>{char(word[4])}</div>
    </div>
  )
}

function App() {
  const input = useRef();
  const [guess, setGuess] = useState('');
  const [guesses, setGuesses] = useState([]);

  useEffect(() => {
    input.current.focus()
  }, []);

  const handleKeyUp = ({key}) => {
    if (key === 'Enter') {
      // alert if guess is not in the word list
      if (!words.includes(guess)) {
        setGuess('');
        return alert('Yanlış kelime')
      }

      // add guess to guessed word list
      if (words.includes(guess)) {
        setGuesses([...guesses, guess]);
      }

      setGuess('');
    }
  }

  const winGame = () => {
    alert('Tebrikler!')
  }

  return (
    <div className="container-fluid" onClick={e => input.current.focus()}>
      <div className="App">

        <h1 style={{fontWeight: 'bolder', marginTop: 20}}>WORDLE Türkçe</h1>
        <p style={{marginTop: 20}}>Limitsiz Türkçe Wordle</p>

        {guesses.map((item, index) => (
          <GuessedRow key={index} winner={selectedWord} word={item} onWin={winGame}/>
        ))}

        <Row word={guess} />

        {[...new Array(5 - guesses.length)].map((x, index) => (
          <GuessedRow key={index} word={''} />
        ))}

        <input
          className={'input'}
          ref={input}
          type="text"
          maxLength={5}
          autoFocus
          value={guess}
          onChange={e => setGuess(e.target.value)}
          onKeyPress={handleKeyUp}
        />
      </div>
    </div>
  )
}

export default App
