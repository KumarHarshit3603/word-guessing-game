import { useCallback, useEffect, useState } from "react"
import words from "./wordlist.json"
import { HangmanDrawing } from "./HangmanDrawing.tsx"
import { Hangmanword } from "./Hangmanword.tsx"
import { Keyboard } from "./keyboard.tsx"
function App() {
  const [wordToGuess, setWordToGuess] = useState(()=>{
    return words[Math.floor(Math.random()*words.length)]
  })
  const [guessedLetters, setGuessedLetters] = useState<string[]>([])
  const incorrectLetters = guessedLetters.filter(letter => !wordToGuess.includes(letter))
  const isLoser = incorrectLetters.length >=6
  const isWinner = wordToGuess.split("").every(letter => guessedLetters.includes(letter))
  function addGuessedLetter(letter:string){
    if(guessedLetters.includes(letter)|| isLoser||isWinner) return
    setGuessedLetters(currentLetters => [...currentLetters,letter]),
    [guessedLetters,isWinner,isLoser]
  }
 useEffect(()=>{
    const handler = (e:KeyboardEvent)=>{
      const key = e.key
      if(key!=="Enter") return
      e.preventDefault()
      setGuessedLetters([])
      setWordToGuess(words[Math.floor(Math.random()*words.length)])
    }
    document.addEventListener("keypress",handler)
    return ()=>{
      document.removeEventListener("keypress",handler)
    }
 },[])
  useEffect(()=>{
    const handler = (e:KeyboardEvent)=>{
      const key = e.key
      if(!key.match(/^[a-z]$/)) return
      e.preventDefault()
      addGuessedLetter(key)
    }
    document.addEventListener("keypress",handler)
    return ()=>{
      document.removeEventListener("keypress",handler)
    }
  },[guessedLetters])
  return <div
    style={{
      maxWidth: "800px",
      display: "flex",
      flexDirection: "column",
      gap: "2rem",
      margin: "0 auto",
      alignItems: "center"
    }}>
      <div>
          {isWinner && "You Win! - Refresh to try again"}
          <div>The correct word is {wordToGuess}</div>
          {isLoser && "You Lose! - Refresh to try again"}
      </div>
      <HangmanDrawing numberOfGuessess={incorrectLetters.length}/>
      <Hangmanword guessedLetters={guessedLetters} wordToGuess={wordToGuess}/>
      <div style={{alignSelf:"stretch"}}>
      <Keyboard activeLetters={guessedLetters.filter(letter => wordToGuess.includes(letter))} inactiveLetters={incorrectLetters} addGuessedLetter={addGuessedLetter} disabled={isWinner || isLoser}/>
      </div>
  </div>
}
export default App