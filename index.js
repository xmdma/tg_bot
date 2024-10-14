const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./option')
const token = '7643726786:AAEu5YlOX0bCjBKRhO7DyUisU1a8YOddWiw'
const bot = new TelegramApi(token, {polling: true})
const chats = {}
const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Давай сыграем в игру) Я загадаю цифру от 0 до 9, а ты должен её угадать!')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Запустить бота'},
        {command: '/info', description: 'Информация о пользователе'},
        {command: '/game', description: 'Игра Угадай цифру'},
    ])
    bot.on( 'message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/25d/f5a/25df5a18-cf79-4b3e-a2f1-4862771ebd1c/10.webp')
            return  bot.sendMessage(chatId, `👋 Привет, ${msg.from.first_name} ! 
Добро пожаловать в моего первого Telegram-бота от пользователя @ddan1il ! 

Вот некоторые команды, которые ты можешь использовать:
/start - Начало общения с ботом
/info  -  Информация о пользователе
/game  -  Игра "Угадай цифру"

Если у тебя есть вопросы, просто напиши! 😊`)
        }
        if (text === '/info') {
            return bot.sendMessage(chatId,  `Тебя зовут ${msg.from.first_name}`)
        }
        if (text === '/game') {
            return startGame(chatId);

        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю, выбери команду из списка!')
    })
    bot.on('callback_query', async msg => {
        const data =msg.data;
        const chatId = msg.message.chat.id;
        if(data === '/again') {
            return startGame(chatId)

        }
        if(data === chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions)

        }

        bot.sendMessage(chatId, `Ты выбрал цифру ${data}`)
        console.log(msg)
    })
}
start()