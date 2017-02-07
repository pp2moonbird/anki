var STORAGE_KEY = 'anki';

ankiStorage = {
    fetch: function () {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    },
    save: function (decks) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
    }
}

var app = new Vue({
    el: '#anki',

    data: {
        newDeckName:'',
        editedDeck: null,
        beforeEditDeckNameCache:'',
        selectedDeck : null,
        questionRawText: '',
        answerRawText: '',
        // questionHTML: '',
        // answerHTML: '',
        cardRawText: '',
        addFlag : false,
        editFlag : false,
        editedCard : null,
        isSimpleMode: true,
        decks: ankiStorage.fetch()
    },

    watch:{
        decks:{
            handler: function(decks){
                ankiStorage.save(decks);
            },
            deep: true
        }
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

        exportDeck: function(deck){
            this.$http.post('/deck', JSON.stringify(deck));
        },

        addCard: function(){
            this.addFlag = true;
            this.eidtFlag = false;
            this.editedCard = {cardRawText:'', question:'', answer:'', isSimpleMode:true, questionHTML:'', answerHTML:''};
            this.enterEdit(this.editedCard);
        },

        deleteCard: function(card){
            this.selectedDeck.cards.$remove(card);
        },

        editCard: function(card){
            this.addFlag = false;
            this.editFlag = true;
            card.cardRawText = card.question + ';' + card.answer;
            this.editedCard = card;
            this.enterEdit(this.editedCard);            
        },

        enterEdit: function(card){
            //TODO currently not fully use of vuejs' declaritive feature
            this.cardRawText = card.cardRawText;
            this.questionRawText = card.question;
            this.answerRawText = card.answer;
            this.isSimpleMode = card.isSimpleMode;
            // these codes caused add second card contains first card data
            // if(card.isSimpleMode){
            //     this.cardRawText = card.cardRawText;
            // }
            // else{
            //     this.questionRawText = card.questionRawText;
            //     this.answerRawText = card.answerRawText;
            // }
        },

        exitEditMode: function(){
            this.editFlag = false;
            this.addFlag = false;
            //this.editedCard = null;
        },

        doneEditCard: function(){
            if(this.isSimpleMode){
                var card = this.editedCard;
                // var pattern = /(.+);(.+)/g;
                // var match = pattern.exec(this.cardRawText);
                // var q = match[1].trim();
                // var a = match[2].trim();
                var cardSplit = this.cardRawText.split(';');
                card.question = cardSplit[0];
                if(cardSplit.length>1){
                    card.answer = cardSplit[1];
                }
            }
            else{
                var card = this.editedCard;
                card.question = this.questionRawText;
                card.answer = this.answerRawText;
                card.cardRawText = this.cardRawText;
                card.isSimpleMode = this.isSimpleMode;
                card.questionHTML = this.compiledQuestionMarkdown;
                card.answerHTML = this.compiledAnswerMarkdown;
            }
            if(this.addFlag){            
                this.selectedDeck.cards.push(card);
                this.addCard();
            }
            else if(this.editFlag){
                var index = this.selectedDeck.cards.indexOf(card);
                this.selectedDeck.cards.splice(index, 1, card);
                this.exitEditMode();
            }
        },

        saveChange: function(){
            if(this.editFlag){
                this.editFlag = false;
            }
            else if(this.addDeck){

            }
        },

        selectSimpleMode: function(){
            this.isSimpleMode = true;
            this.cardRawText = this.questionRawText + ';' + this.answerRawText;
        },

        selectAdvancedMode: function(){
            this.isSimpleMode = false;
            var cardSplit = this.cardRawText.split(';');
            this.questionRawText = cardSplit[0];
            if(cardSplit.length>1){
                this.answerRawText = cardSplit[1];
            }
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