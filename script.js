//функция поиска положения блока
const findBlock = (obj) => {
    let blockPosition = obj.getBoundingClientRect()
    blockPosition = {
        x1: blockPosition.left, //левые верхний и нижний
        y1: blockPosition.top, //правый и левый верхние
        x2: blockPosition.right, //правые верхний и нижний
        y2: blockPosition.bottom, //левый и правый нижние
        x3: blockPosition.left + blockPosition.width / 2,
        w: blockPosition.width,
        //h: blockPosition.height
    }
    return blockPosition
}

//определение всех элементов на странице
let documentWidth
const wallHTML = document.querySelector('#wall')
let wall = findBlock(wallHTML)
const ball = document.querySelector('#ball')
let ballStart = findBlock(ball)
const platform = document.querySelector('#platform')
let platformStart = findBlock(platform)
const pointsHTML = document.querySelector('#points')
const start = document.querySelector('#startButton')
let startButtonPosition = findBlock(start)
const repeat = document.querySelector('#repeatButton')

//функция определения начального положения поля
const allStartPosition = () => {
    documentWidth = document.documentElement.clientWidth
    //положение стен
    wallHTML.style.width = '0px' //обнуление до минимальной ширины
    wall = findBlock(wallHTML)
    wallHTML.style.left = (documentWidth - wall.w) / 2 + 'px'
    wall = findBlock(wallHTML)
        wall.x1 = wall.x1 + 10 //стены с учетом border
        wall.x2 = wall.x2 - 10
        wall.y1 = wall.y1 + 10
        wall.y2 = wall.y2 - 10
    //положение шарика
    ball.style.left = (documentWidth - ballStart.w) / 2 + 'px'
    ball.style.top = wall.y1 + ballStart.w + 'px'
    //положение платформы
    platform.style.left = (documentWidth - platformStart.w) / 2 + 'px'
    platform.style.top = wall.y2 - 10 + 'px'
    platform.style.width = platformStart.w + 'px' //возврат платформы к максимальной ширине
    //положение очков
    pointsHTML.style.left = wall.x2 + 'px'
    points = 0
    //положение кнопки старта
    start.style.left = (documentWidth - startButtonPosition.w) / 2 + 'px'
    //положение кнопки повтора
    repeat.style.left = (documentWidth - startButtonPosition.w) / 2 + 'px'
}

//скрипты для клавиатуры и игрока
let isLeftKeyDown, isRightKeyDown
document.addEventListener('keydown', (event) => {
    if (event.code === 'ArrowLeft' || event.code === 'KeyA') isLeftKeyDown = true
    if (event.code === 'ArrowRight' || event.code === 'KeyD') isRightKeyDown = true
})
document.addEventListener('keyup', (event) => {
    if (event.code === 'ArrowLeft' || event.code === 'KeyA') isLeftKeyDown = false
    if (event.code === 'ArrowRight' || event.code === 'KeyD') isRightKeyDown = false
})
const movePlatform = () => {
    const position = findBlock(platform)
    if ((isLeftKeyDown) && (position.x1 >= wall.x1)) {
        platform.style.left = (position.x1 - 5) + 'px'
    }
    if ((isRightKeyDown) && (position.x2 <= wall.x2)) {
        platform.style.left = (position.x1 + 5) + 'px'
    }
    setTimeout(movePlatform, 10)
}

//запускает игру
start.onclick = () => {
    start.style.display = 'none'
    document.querySelector('p').style.display = 'none'
    moveRD(random(minAngle, maxAngle), 1)
}
movePlatform()
allStartPosition()

//скрипты при проигрыше
const background = document.querySelector('body')
const loseGame = () => {
    background.style.backgroundColor = 'red'
    setTimeout( () => {
        alert('Вы набрали ' + points + ' очков!')
        background.style.backgroundColor = 'grey'
        repeat.style.display = 'block'
        allStartPosition()
        pointsHTML.innerHTML = '0'
    }, 300)
}
repeat.onclick = () => {
    repeat.style.display = 'none'
    moveRD(random(minAngle, maxAngle), 1)
}

//функции движения шарика
const minAngle = 30, maxAngle = 60 //размах углов при отскакивании от стены
const moveRD = (angle, speed) => {
    console.log('Скорость: ' + speed + ', угол: ' + angle)
    const crash = setInterval ( () => {
        const position = findBlock(ball)
        const platformPosition = findBlock(platform)
        ball.style.left = (position.x1 + speed * (1 - angle/90)) + 'px'
        ball.style.top = (position.y1 + speed * angle/90) + 'px'
        if (position.x2 >= wall.x2) {
            const newAngle = random(minAngle, maxAngle)
            clearInterval(crash)
            moveLD(newAngle, speed)
        }
        if ((position.y2 >= platformPosition.y1) && 
        (position.x3 >= platformPosition.x1) && 
        (position.x3 <= platformPosition.x2)){
            const newAngle = random(minAngle, maxAngle)
            clearInterval(crash)
            //при ударе о платформу
            const newSpeed = speed + 0.05
            platform.style.width = platformPosition.w - 1 + 'px'
            wallHTML.style.width = wall.w - 18 + 'px'
            wallHTML.style.left = wall.x1 - 11 + 'px'
            wall = findBlock(wallHTML)
                wall.x1 = wall.x1 + 10 //стены с учетом border
                wall.x2 = wall.x2 - 10
                wall.y1 = wall.y1 + 10
                wall.y2 = wall.y2 - 10
            points++
            pointsHTML.innerHTML = points
            moveRU(newAngle, newSpeed)
        }
        else if (position.y2 >= wall.y2) {
            clearInterval(crash)
            loseGame()
        }
    }, 1)
}
const moveLD = (angle, speed) => {
    console.log('Скорость: ' + speed + ', угол: ' + angle)
    const crash = setInterval ( () => {
        const position = findBlock(ball)
        const platformPosition = findBlock(platform)
        ball.style.left = (position.x1 - speed * angle/90) + 'px'
        ball.style.top = (position.y1 + speed * (1 - angle/90)) + 'px'
        if (position.x1 <= wall.x1) {
            const newAngle = random(minAngle, maxAngle)
            clearInterval(crash)
            moveRD(newAngle, speed)
        }
        if ((position.y2 >= platformPosition.y1) && 
        (position.x3 >= platformPosition.x1) && 
        (position.x3 <= platformPosition.x2)){
            const newAngle = random(minAngle, maxAngle)
            clearInterval(crash)
            //при ударе о платформу
            const newSpeed = speed + 0.05
            platform.style.width = platformPosition.w - 1 + 'px'
            wallHTML.style.width = wall.w - 18 + 'px'
            wallHTML.style.left = wall.x1 - 11 + 'px'
            wall = findBlock(wallHTML)
                wall.x1 = wall.x1 + 10 //стены с учетом border
                wall.x2 = wall.x2 - 10
                wall.y1 = wall.y1 + 10
                wall.y2 = wall.y2 - 10
            points++
            pointsHTML.innerHTML = points
            moveLU(newAngle, newSpeed)
        }
        else if (position.y2 >= wall.y2) {
            clearInterval(crash)
            loseGame()
        }
    }, 1)
}
const moveRU = (angle, speed) => {
    console.log('Скорость: ' + speed + ', угол: ' + angle)
    const crash = setInterval ( () => {
        const position = findBlock(ball)
        ball.style.left = (position.x1 + speed * angle/90) + 'px'
        ball.style.top = (position.y1 - speed * (1 - angle/90)) + 'px'
        if (position.y1 <= wall.y1) {
            const newAngle = random(minAngle, maxAngle)
            clearInterval(crash)
            moveRD(newAngle, speed)
        }
        if (position.x2 >= wall.x2) {
            const newAngle = random(minAngle, maxAngle)
            clearInterval(crash)
            moveLU(newAngle, speed)
        }
    }, 1)
}
const moveLU = (angle, speed) => {
    console.log('Скорость: ' + speed + ', угол: ' + angle)
    const crash = setInterval ( () => {
        const position = findBlock(ball)
        ball.style.left = (position.x1 - speed * (1 - angle/90)) + 'px'
        ball.style.top = (position.y1 - speed * angle/90) + 'px'
        if (position.x1 <= wall.x1) {
            const newAngle = random(minAngle, maxAngle)
            clearInterval(crash)
            moveRU(newAngle, speed)
        }
        if (position.y1 <= wall.y1) {
            const newAngle = random(minAngle, maxAngle)
            clearInterval(crash)
            moveLD(newAngle, speed)
        }
    }, 1)
}
const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}