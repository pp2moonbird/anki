var app = new Vue({
    el: '#anki',

    data: {
        newDeckName:'',
        editedDeck: null,
        beforeEditDeckNameCache:'',
        selectedDeck : null,
        questionRawText: '',
        answerRawText: '',
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
    },

    computed: {
        compiledQuestionMarkdown: function(){
            return marked(this.questionRawText, {sanitize: true})
        },
        
        compiledAnswerMarkdown: function(){
            return marked(this.answerRawText, {sanitize: true})
        }
    },

    methods: {
        addDeck: function(){
            if (this.newDeckName){
                var result = {deck:this.newDeckName, cards:[]};
                this.decks.push(result);
                this.newDeckName = '';
            }
        },
        
        editDeck: function(deck){
            this.beforeEditDeckNameCache = deck.deck;
            this.editedDeck = deck;
        },

        cancelEditDeck: function(deck){
            if(this.editedDeck){
                deck.deck = this.beforeEditDeckNameCache;
                this.editedDeck = null;
            }
            this.beforeEditDeckNameCache = null;
        },

        doneEditDeck: function(deck){
            var index = this.decks.indexOf(deck);
            if(!this.editedDeck.deck){
                return;
            }
            this.editedDeck = null;
            this.beforeEditDeckNameCache = null;
            this.decks.splice(index, 1, deck);
        },

        deleteDeck: function(deck){
            this.decks.$remove(deck);
        },

        selectDeck: function(deck){
            this.selectedDeck = deck;
        },

        deselectDeck: function(){
            this.selectedDeck = null;
        },

        updateQuestion: _.debounce(function (e){
            this.questionRawText = e.target.value
        }, 300),

        updateAnswer: _.debounce(function (e){
            this.answerRawText = e.target.value
        }, 300)
    },
    
    directives : {
        'item-focus': function(value){
            if(!value){
                return;
            }
            var el = this.el;
                Vue.nextTick(function () {
                el.focus();
            });
        }
    }
})