var app = new Vue({
    el: '#anki',

    data: {
        decks: [
            {
                deck:'My first learning deck',
                cards:[
                    {
                        question: 'what is anki',
                        answer: 'it\'s a flaskcard system'
                    },
                    {
                        question: 'what is this app',
                        answer: 'it\'s a simple tool to generate csv for anki'
                    }
                ]
            },
            {
                deck:'Math Dec',
                cards:[
                    {
                        question: '1+1=?',
                        answer: '2'
                    }
                ]
            }
        ],
    }
})