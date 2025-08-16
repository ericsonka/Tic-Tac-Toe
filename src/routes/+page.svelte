<script>
    let grid_array = Array(9).fill("");
    let current_player = 'x';   // need to place as option on bot mode
    let status = 'player';
    let game_click = true;
    let overlayType = ''; // 'win' | 'draw';
    let showOverlay = false;
    let winningLine = [];
    let modes = 'pvp' // pvp , bot
    let select_mode = true

    function start_game() {
        select_mode = false
    }

    function handle_cell_clicked(clicked_one) {
        console.log(modes)
        if (!game_click) return;
        if (game_click) {
            grid_array[clicked_one] = current_player;
            console.log("grid_array cell clicked", grid_array)
            status = 'bot'
            who_wins();
            current_player = current_player === 'x' ? "o" : 'x';
            if (modes === 'bot') {
                setTimeout(bot_choice, 1000);
            }
        }

    }

    let winning_conditions = [
        {indexes: [0, 1, 2]},
        {indexes: [3, 4, 5]},
        {indexes: [6, 7, 8]},
        {indexes: [0, 3, 6]},
        {indexes: [1, 4, 7]},
        {indexes: [2, 5, 8]},
        {indexes: [0, 4, 8]},
        {indexes: [2, 4, 6]}
    ];

    function who_wins() {
        for (let con of winning_conditions) {
            let [a, b, c] = con.indexes;
            if (grid_array[a] && grid_array[a] === grid_array[b] && grid_array[a] === grid_array[c]) {
                status = `Player ${grid_array[a].toUpperCase()} wins 🎉`;
                game_click = false;
                overlayType = 'win';
                showOverlay = true;
                winningLine = con.indexes;
                setTimeout(() => {
                    rest_grid()
                }, 3000);
                return;
            }
        }

        if (grid_array.every(cell => cell !== "")) {
            status = "It's a draw! 🤝";
            overlayType = 'draw';
            showOverlay = true;
            setTimeout(() => {
                rest_grid()
            }, 3000);
        }
    }

    function bot_choice() {
        // game_click = false;
        status = 'player';
        let empty_grid = grid_array.map((val, i) => (val === "" ? i : null)).filter(i => i !== null);

        let random_choice = empty_grid[Math.floor(Math.random() * empty_grid.length)];

        if (modes === 'bot') {
            for (let i of empty_grid) {
                grid_array[i] = current_player;
                if (check_winner(current_player)) {
                    finalize_bot_move(i);
                    return;
                }
                grid_array[i] = ""; // undo
            }

            let opponent = current_player === "x" ? "o" : "x";
            for (let i of empty_grid) {
                grid_array[i] = opponent;
                if (check_winner(opponent)) {
                    grid_array[i] = ""; // undo
                    finalize_bot_move(i);
                    return;
                }
                grid_array[i] = ""; // undo
            }

            finalize_bot_move(random_choice);
        }
    }


    function finalize_bot_move(i) {

        grid_array[i] = current_player;
        console.log(".finalize_bot_move after,", grid_array)

        current_player = current_player === "x" ? "o" : "x";
        who_wins();
    }

    function check_winner(player) {
        return winning_conditions.some(con => {
            let [a, b, c] = con.indexes;
            console.log("grid_array... checking..", grid_array)
            return grid_array[a] === player && grid_array[b] === player && grid_array[c] === player;
        });
    }

    function rest_grid() {
        grid_array = Array(9).fill("");
        console.log("grid_array rest_grid", grid_array)
        status = '';
        game_click = true;
        showOverlay = false;
        overlayType = '';
        winningLine = [];
        current_player = 'x';
        select_mode = true

    }
</script>

<svelte:head>
    <title>Tic-Tac-Toe | Modern Game</title>
    <meta name="description" content="Beautiful Tic-Tac-Toe game built with SvelteKit"/>
</svelte:head>
{#if select_mode}
    <div class="mode_selection_overlay">
        <div class="mode-selection">
            <h3>Select Game Mode</h3>
            <div class="mode-options">
                <label class="mode-card">
                    <input type="radio" bind:group={modes} value="pvp"/>
                    <span>👥 1 vs 1</span>
                </label>

                <label class="mode-card">
                    <input type="radio" bind:group={modes} value="bot"/>
                    <span>🤖 1 vs Bot</span>
                </label>
            </div>
            <div class="game-controls">
                <button class="restart-btn" on:click={start_game}>
                    <span class="restart-icon">✅</span>
                    start game
                </button>
            </div>
        </div>
    </div>

{/if}

<div class="game-container">
    <div class="game-header">
        <h1 class="game-title">
            Tic-Tac-Toe
            <span class="title-accent">XOX</span>
        </h1>
        <div class="player-indicator">
            <div class="current-player">
                <!--                Current Player: <span class="player-symbol player-{current_player}">{current_player.toUpperCase()}</span>-->
                {#if current_player && status && modes === 'bot'}
                    Play: <span class="player-symbol player-{current_player}">{status}</span>
                {/if}
            </div>
        </div>
    </div>
    {#if modes !== 'bot'}
        <div class="game-status" class:visible={status}>
            {status}
        </div>
    {/if}


    <div class="game-board" class:disabled={!game_click}>
        {#each grid_array as cell, index}
            <button
                    class="game-cell"
                    class:winning-cell={winningLine.includes(index)}
                    on:click={() => handle_cell_clicked(index)}
                    disabled={!game_click || cell !== ''}
            >
                <span class="cell-content cell-{cell}">
                    {cell.toUpperCase()}
                </span>
            </button>
        {/each}
    </div>

    <div class="game-controls">
        <button class="restart-btn" on:click={rest_grid}>
            <span class="restart-icon">🔄</span>
            Restart Game
        </button>
    </div>

    {#if showOverlay}
        <div class="overlay" class:win={overlayType === 'win'} class:draw={overlayType === 'draw'}>
            <div class="overlay-content">
                <div class="overlay-icon">
                    {#if overlayType === 'win'}
                        🏆
                    {:else}
                        🤝
                    {/if}
                </div>
                <div class="overlay-text">
                    {status}
                </div>
                <div class="overlay-subtitle">
                    {#if overlayType === 'win'}
                        Congratulations!
                    {:else}
                        Good game!
                    {/if}
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        /*background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);*/
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .game-container {
        max-width: 500px;
        width: 100%;
        padding: 2rem;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 20px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
        position: relative;
        overflow: hidden;
    }

    /*.game-container::before {*/
    /*    content: '';*/
    /*    position: absolute;*/
    /*    top: 0;*/
    /*    left: 0;*/
    /*    right: 0;*/
    /*    height: 4px;*/
    /*    background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffd93d);*/
    /*    background-size: 400% 400%;*/
    /*    animation: gradient 3s ease infinite;*/
    /*}*/

    @keyframes gradient {
        0%, 100% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
    }

    .game-header {
        text-align: center;
        margin-bottom: 2rem;
    }

    .game-title {
        font-size: 2.5rem;
        font-weight: 700;
        color: #2c3e50;
        margin: 0;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    }

    .title-accent {
        color: #e74c3c;
        font-size: 1.5rem;
        vertical-align: super;
        opacity: 0.8;
    }

    .player-indicator {
        margin-top: 1rem;
    }

    .current-player {
        font-size: 1.2rem;
        color: #34495e;
        font-weight: 500;
    }

    .player-symbol {
        display: inline-block;
        font-weight: 700;
        font-size: 1.4rem;
        padding: 0.2rem 0.8rem;
        border-radius: 12px;
        margin-left: 0.5rem;
        transition: all 0.3s ease;
    }

    .player-x {
        background: linear-gradient(135deg, #e74c3c, #c0392b);
        color: white;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
    }

    .player-o {
        background: linear-gradient(135deg, #3498db, #2980b9);
        color: white;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
    }

    .game-status {
        text-align: center;
        font-size: 1.3rem;
        font-weight: 600;
        color: #2c3e50;
        margin-bottom: 1rem;
        height: 2rem;
        opacity: 0;
        transition: all 0.3s ease;
    }

    .game-status.visible {
        opacity: 1;
    }

    .game-board {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.8rem;
        margin-bottom: 2rem;
        transition: opacity 0.3s ease;
    }

    .game-board.disabled {
        opacity: 0.7;
    }

    .game-cell {
        aspect-ratio: 1;
        background: white;
        border: 3px solid #ecf0f1;
        border-radius: 16px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 2.5rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
    }

    .game-cell::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.2));
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .game-cell:hover::before {
        opacity: 1;
    }

    .game-cell:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        border-color: #bdc3c7;
    }

    .game-cell:disabled {
        cursor: not-allowed;
    }

    .game-cell:disabled:hover {
        transform: none;
        box-shadow: none;
    }

    .winning-cell {
        background: linear-gradient(135deg, #f39c12, #e67e22) !important;
        border-color: #d68910 !important;
        animation: pulse 1s ease-in-out infinite;
    }

    .winning-cell .cell-content {
        color: white !important;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }

    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }

    .cell-content {
        transition: all 0.3s ease;
        transform: scale(0);
        animation: pop 0.3s ease forwards;
    }

    @keyframes pop {
        0% {
            transform: scale(0) rotate(0deg);
        }
        80% {
            transform: scale(1.2) rotate(5deg);
        }
        100% {
            transform: scale(1) rotate(0deg);
        }
    }

    .cell-x {
        color: #e74c3c;
        text-shadow: 2px 2px 4px rgba(231, 76, 60, 0.3);
    }

    .cell-o {
        color: #3498db;
        text-shadow: 2px 2px 4px rgba(52, 152, 219, 0.3);
    }

    .game-controls {
        text-align: center;
    }

    .restart-btn {
        background: linear-gradient(135deg, #9b59b6, #8e44ad);
        color: white;
        border: none;
        padding: 0.8rem 2rem;
        border-radius: 25px;
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin: 0 auto;
    }

    .restart-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(155, 89, 182, 0.4);
        background: linear-gradient(135deg, #8e44ad, #9b59b6);
    }

    .restart-icon {
        font-size: 1.2rem;
        animation: rotate 2s linear infinite paused;
    }

    .restart-btn:hover .restart-icon {
        animation-play-state: running;
    }

    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    .overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 20px;
        animation: fadeIn 0.5s ease;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    .overlay-content {
        text-align: center;
        color: white;
        animation: slideUp 0.5s ease;
    }

    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(50px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .overlay-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
        animation: bounce 2s ease-in-out infinite;
    }

    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-20px);
        }
        60% {
            transform: translateY(-10px);
        }
    }

    .overlay-text {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }

    .overlay-subtitle {
        font-size: 1.2rem;
        opacity: 0.8;
        font-weight: 400;
    }

    .overlay.win {
        background: rgba(46, 204, 113, 0.9);
    }

    .overlay.draw {
        background: rgba(241, 196, 15, 0.9);
    }

    @media (max-width: 600px) {
        .game-container {
            margin: 1rem;
            padding: 1.5rem;
        }

        .game-title {
            font-size: 2rem;
        }

        .game-cell {
            font-size: 2rem;
        }

        .overlay-text {
            font-size: 1.5rem;
        }

        .overlay-icon {
            font-size: 3rem;
        }
    }

    .mode_selection_overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
        display: flex;
        align-items: center;
        justify-content: center;
        /*border-radius: 20px;*/
        z-index: 4444;
        animation: fadeIn 1s ease;
    }

    .mode-selection {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        padding: 1.5rem;
        border-radius: 1rem;
        background: #fff;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        width: 100%;
        margin: 34px;
        /* margin: auto; */
        max-width: 350px;
    }

    .mode-selection h3 {
        margin: 0;
        font-size: 1.2rem;
        font-weight: 600;
        color: #333;
    }

    .mode-options {
        display: flex;
        gap: 1rem;
        width: 100%;
        justify-content: space-around;
    }

    .mode-card {
        flex: 1;
        cursor: pointer;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0.8rem;
        border-radius: 0.75rem;
        border: 2px solid #ccc;
        transition: all 0.2s ease;
        font-size: 1rem;
        font-weight: 500;
        background: #f9f9f9;
        user-select: none;
    }

    .mode-card:hover {
        border-color: #007bff;
        background: #eef5ff;
    }

    .mode-card input {
        position: absolute;
        opacity: 0;
        pointer-events: none;
    }

    .mode-card input:checked + span {
        color: #007bff;
        font-weight: 600;
    }

    .mode-card input:checked ~ * {
        border-color: #007bff;
        background: #e7f0ff;
    }


</style>