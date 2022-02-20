import {useEffect, useRef, useState} from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap-grid.min.css'
import words from './words';
import konamiHandler from './konamiHandler'
import {registerSW} from "virtual:pwa-register";

if ("serviceWorker" in navigator) {
  // && !/localhost/.test(window.location)) {
  registerSW();
}

const selectedWord = "kalem" //words[Math.floor(Math.random() * words.length)];
const tr_chars = "abcçdefgğhiıjklmnoöprsştuüvyz"

document.addEventListener('keydown', function (e) {
  konamiHandler(e, selectedWord)
}, false);

const char = (c) => {
  return c?.toLocaleUpperCase('tr-TR')
}

const multiIndexOf = function (arr, el) {
  const idxs = [];
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] === el) {
      idxs.unshift(i);
    }
  }
  return idxs;
}

const writeStats = (state) => {
  const prevState = JSON.parse(window.localStorage.getItem('stats') || '[]')
  window.localStorage.setItem('stats', JSON.stringify([...prevState, state]))
}

const loadStats = () => {
  const prevState = JSON.parse(window.localStorage.getItem('stats') || '[]')

  let won = 0;
  let lost = 0;
  const total = prevState.length;

  prevState.map(item => {
    if (item === 'won') won += 1
    if (item === 'lost') lost += 1
  })

  return {won, lost, total}
}

const GuessedRow = ({selected, word, onWin}) => {
  const [status, setStatus] = useState([...new Array(5).map(() => 0)])

  useEffect(() => {
    let arr = [];

    if (selected && word) {

      if (selected === word) {
        setStatus([2, 2, 2, 2, 2]);
        onWin()
        return null;
      }

      // word = kakül
      // selected = kalem

      const letterStates = {};
      word.split('').map((w, idx) => {
        if (selected.split('')[idx] === w) {
          arr[idx] = letterStates[w] = 2
        }
      })

      // if char exists in selected word
      word.split('').map((w, idx) => {
        if (selected.split('').includes(w)) {
          if (!letterStates[w]) {
            arr[idx] = letterStates[w] = 1;
          }
        }
      })

      // if char not exists in selected word
      word.split('').map((w, idx) => {
        if (!selected.split('').includes(w)) {
          arr[idx] = 0;
          if (!letterStates[w]) {
            letterStates[w] = 0;
          }
        }
      })

      setStatus(arr)

    }
  }, [selected, word]);

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
  const [disabled, setDisabled] = useState(false);
  const [gameState, setGameState] = useState('playing');

  const {won, lost, total} = loadStats();

  useEffect(() => {
    input.current.focus()
  }, []);

  useEffect(() => {
    if (guesses.length === 6) {
      setDisabled(true);
      if (gameState === 'playing') {
        setGameState('lost')
        lostGame()
      }
    }
  }, [guesses]);

  const handleKeyUp = ({key}) => {
    if (key === 'Enter') {
      // alert if guess is not in the word list
      if (!words.includes(guess)) {
        setGuess('');
        return alert('Hatalı kelime')
      }

      // add guess to guessed word list
      if (words.includes(guess)) {
        setGuesses([...guesses, guess]);
      }

      setGuess('');
    }
  }

  const winGame = () => {
    setDisabled(true);
    setGameState('won');
    writeStats('won');
  }

  const lostGame = () => {
    setDisabled(true);
    setGameState('lost');
    writeStats('lost');
  }

  return (
    <div className="container-fluid" onClick={e => input.current.focus()}>
      <div className="App">
        <h1 style={{fontWeight: 'bolder', margin: '20px 0 40px', textAlign: 'center'}}>
          <span className={'green-t'}>W</span>
          <span className={'yellow-t'}>O</span>
          <span className={'red-t'}>R</span>
          <span className={'gray-t'}>D</span>
          <span className={'green-t'}>L</span>
          <span className={'yellow-t'}>E</span>
          <span className={'white-t'}>Türkçe</span>
        </h1>
        <p>{selectedWord}</p>

        {guesses.map((item, index) => (
          <GuessedRow key={index} selected={selectedWord} word={item} onWin={winGame} />
        ))}

        {guesses.length < 6 && <Row word={guess} />}

        {guesses.length < 5 && [...new Array(5 - guesses.length)].map((x, index) => (
          <GuessedRow key={index} word={''} />
        ))}

        <div className={`status ${gameState}`} onClick={() => window.location.reload()}>
          {gameState === 'won' && "Tebrikler!"}
          {gameState === 'lost' && (
            <div style={{fontWeight: 'normal'}}>Doğru Cevap: <span style={{fontWeight: 'bolder'}}>"{selectedWord}"</span></div>
          )}
        </div>

        {gameState !== 'playing' && <div className="status gray" onClick={() => window.location.reload()}>Yeniden Başlayın!</div>}

        <input
          disabled={disabled}
          className={'input'}
          ref={input}
          type="text"
          maxLength={5}
          autoFocus
          value={guess}
          onChange={e => setGuess(e.target.value.toLocaleLowerCase('tr-TR'))}
          onKeyPress={handleKeyUp}
        />

        <div className="tr-chars">
          {tr_chars.split('').map((x, idx) => {
            const usedChars = guesses.join('').split('')
            return (
              <span
                key={idx}
                className={
                  `${usedChars.includes(x) && 'gray-t'}
                `}
              >
                {char(x)}
              </span>
            )
          })}
        </div>

      </div>

      <div className="stats">
        <div className="d">istatistik</div>
        <span className={'green-t'}>{won} <span className="s">kazanan</span></span> / {" "}
        <span className={'red-t'}>{lost} <span className="s">kaybeden</span></span> / {" "}
        <span className={'yellow-t'}>{total} <span className="s">toplam</span></span>
      </div>
    </div>
  )
}

export default App
