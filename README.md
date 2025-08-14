### README.md

# Round 2 Integration Challenge

This project integrates a live, two-player game with a blockchain-based staking and payout system. It extends the smart contracts and API built in Round 1 by adding a real-time game server and a game frontend.

-----

### Game Source Reference

  * The game is a simple **Tic-Tac-Toe** clone, built from scratch using HTML, CSS, and JavaScript. The game logic is contained within `frontend-game/public/index.html`.

-----

### API/Contract Integration Points

The system flow is fully integrated, from game discovery to on-chain payout.

  * **Buying Game Tokens (GT)**: The player initiates a purchase from the game's UI. [cite\_start]The frontend handles the `USDT.approve()` transaction [cite: 86][cite\_start], and then calls the `blockchain-backend` API, which broadcasts the `TokenStore.buy()` transaction on-chain[cite: 87].
  * [cite\_start]**Staking**: When two players are matched, the game client prompts each player to approve the `PlayGame` contract to spend their GT stake[cite: 101]. [cite\_start]It then calls `PlayGame.stake()`[cite: 102], which pulls the GT from each player into an escrow.
  * [cite\_start]**Winner Payout**: After a winner is determined by the game server, the server calls the `blockchain-backend` API to submit the result[cite: 108, 110]. [cite\_start]The API then triggers the `PlayGame.commitResult()` function, which transfers the combined stakes (2x) to the winner's wallet[cite: 111].

-----

### Matchmaking Logic

The matchmaking process is managed by the `game-server` using **Socket.IO**:

1.  [cite\_start]A player joins a queue by selecting a stake amount[cite: 90].
2.  [cite\_start]The system searches for another online player with the same stake[cite: 36].
3.  [cite\_start]When two players are found, a unique `matchId` is created[cite: 94], and a new game room is established. [cite\_start]Both players are notified and prompted to stake their tokens[cite: 96].
4.  [cite\_start]The game only starts after both players have successfully staked their GT[cite: 38, 103].

-----

### How to Run the Game Locally

1.  **Start your local blockchain network** (e.g., Hardhat):

    ```shell
    npx hardhat node
    ```

2.  **Run the Blockchain Backend (API Gateway)**:

    ```shell
    cd blockchain-backend
    node src/server.js
    ```

3.  **Run the Game Server**:

    ```shell
    cd game-server
    node src/index.js
    ```

4.  **Open the Frontend**:

      * Open `frontend-game/public/index.html` in your web browser.
      * Ensure your wallet (e.g., MetaMask) is connected to your local network. You can simulate the full flow by having two browser windows open, each with a different wallet account.