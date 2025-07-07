import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import styled from 'styled-components'

const MainContainer = styled.div`
  * {
    margin: 0;
    top: 0;
  }
body {
  background-color: #f0f0f0;
  margin: 0;
  font-family: 'Arial', sans-serif;
}

`

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MainContainer>
      <App />
    </MainContainer>
  </StrictMode>,
)
