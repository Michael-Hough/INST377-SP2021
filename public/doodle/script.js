/* eslint-disable */
document.addEventListener("DOMContentLoaded", () => 
{
    const grid = document.querySelector(".grid");
    const doodler = document.createElement("div");
    let startPoint = 150;
    let doodlerLeftSpace = 50;
    let doodlerBottomSpace = startPoint;
    let isGameOver = false;
    let platformCount = 5;
    let platforms = []
    let score = 0;
    let isJumping = true;
    let isGoingLeft = false;
    let isGoingRight = false;
    const gravity = 0.9;
    let upTimerId;
    let downTimerId;
    let leftTimerId;
    let rightTimerId;

    class Platform 
    {   
        constructor(newPlatformBottom)
        {
            this.bottom = newPlatformBottom;
            this.left = Math.random() * 315;
            this.visual = document.createElement("div");

            const visual = this.visual;
            visual.classList.add("platform");
            visual.style.left = this.left + "px";
            visual.style.bottom = this.bottom + "px";
            grid.appendChild(visual);
        }
    }

    function createDoodler()
    {
        grid.appendChild(doodler);
        doodler.classList.add("doodler");
        doodler.style.left = doodlerLeftSpace + "px";
        doodler.style.bottom = doodlerBottomSpace + "px";
    }

    function fall() 
    {
        isJumping = false
        clearInterval(upTimerId)
        downTimerId = setInterval(function () 
        {
            doodlerBottomSpace -= 5;
            doodler.style.bottom = doodlerBottomSpace + "px";
            
            if (doodlerBottomSpace <= 0) 
            {
              gameOver()
            }
            
            platforms.forEach(platform => 
            {
              if (
                (doodlerBottomSpace >= platform.bottom) &&
                (doodlerBottomSpace <= (platform.bottom + 15)) &&
                ((doodlerLeftSpace + 60) >= platform.left) && 
                (doodlerLeftSpace <= (platform.left + 85)) &&
                !isJumping
                ) 
                {
                  startPoint = doodlerBottomSpace;
                  jump();
                  isJumping = true;
                }
            })
      
          },20)
    }

    function jump() 
    {
        clearInterval(downTimerId);
        isJumping = true;
        upTimerId = setInterval(function () 
        {
          doodlerBottomSpace += 20;
          doodler.style.bottom = doodlerBottomSpace + "px";
          
          if (doodlerBottomSpace > (startPoint + 200)) 
          {
            fall();
            isJumping = false;
          }
        },30)
    }

    function moveLeft() 
    {
        if (isGoingRight) 
        {
            clearInterval(rightTimerId);
            isGoingRight = false;
        }

        isGoingLeft = true;
        leftTimerId = setInterval(function () 
        {
            if (doodlerLeftSpace >= 0) 
            {
                doodlerLeftSpace -= 5;
                doodler.style.left = doodlerLeftSpace + "px";
            } 
            
            else 
                moveRight();
        },20)
    }

    function moveRight() 
    {
        if (isGoingLeft) 
        {
            clearInterval(leftTimerId);
            isGoingLeft = false;
        }

        isGoingRight = true;
        rightTimerId = setInterval(function () 
        {
          if (doodlerLeftSpace <= 313) 
          {
            doodlerLeftSpace += 5;
            doodler.style.left = doodlerLeftSpace + "px";
          } 
          
          else 
              moveLeft();
        },20)
    }

    function moveStraight() 
    {
        isGoingLeft = false;
        isGoingRight = false;
        clearInterval(leftTimerId);
        clearInterval(rightTimerId);
    }

    function control(e) 
    {
        doodler.style.bottom = doodlerBottomSpace + "px";
        
        if(e.code === "ArrowLeft") 
        {
          moveLeft();
        } 

        else if (e.code === "ArrowRight") 
        {
          moveRight();
        }

        else if (e.code === "ArrowUp") 
        {
          moveStraight();
        }
      }

    function createPlatforms()
    {
        for(let x = 0; x < platformCount; x++)
        {
            let platformGap = 600 / platformCount;
            let newPlaformBottom = 100 + (x * platformGap);
            let newPlatform = new Platform(newPlaformBottom);
            platforms.push(newPlatform);
        }
    }

    function movePlatforms()
    {
        if (doodlerBottomSpace > 200) 
        {
            platforms.forEach(platform => 
            {
              platform.bottom -= 4;
              let visual = platform.visual;
              visual.style.bottom = platform.bottom + "px";
    
              if(platform.bottom < 10) 
              {
                let firstPlatform = platforms[0].visual;
                firstPlatform.classList.remove("platform");
                platforms.shift();
                score++;
                let newPlatform = new Platform(600);
                platforms.push(newPlatform);
              }
          }) 
        }
    }

    function gameOver() 
    {
        isGameOver = true;
        
        while (grid.firstChild) 
        {
          grid.removeChild(grid.firstChild);
        }

        grid.innerHTML = score;
        clearInterval(upTimerId);
        clearInterval(downTimerId);
        clearInterval(leftTimerId);
        clearInterval(rightTimerId);
    }

    function start()
    {
        if(!isGameOver)
        {
            createDoodler();
            createPlatforms();
            setInterval(movePlatforms,30);
            jump(startPoint);
            document.addEventListener("keyup", control);
        }
    }

    start();
});