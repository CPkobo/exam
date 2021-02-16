const vm = new Vue({
    el: '#app',
    data,
    computed: {
        total() {
            let total_ = 0
            for (const q of this.qs) {
                if (q.get > 0) {
                    total_ += q.get
                }
            }
            return total_
        }
    },
    methods: {
        checkThis(isCorrect, opx) {
            this.qs[this.page].options[opx][isCorrect] = !this.qs[this.page].options[opx][isCorrect]
            this.checkAnother(isCorrect, opx)
        },
        checkAnother(isCorrect, opx) {
            const another = isCorrect === 'c' ? 'i' : 'c'
            if (this.qs[this.page].options[opx][isCorrect]) {
                this.qs[this.page].options[opx][another] = false
            }
        },
        clearCheck() {
            for (const opt of this.qs[this.page].options) {
                opt.c = false
                opt.i = false
            }
        },
        answer() {
            let hasError = false
            let myAnswer = -1
            for (let i = 0; i < this.qs[this.page].options.length; i++) {
                if (this.qs[this.page].isSelectCorrect && this.qs[this.page].options[i].c) {
                    if (myAnswer === -1) {
                        myAnswer = i + 1
                    } else {
                        alert('複数の選択肢が選ばれています')
                        hasError = true
                        break
                    }
                }
                if (!this.qs[this.page].isSelectCorrect && this.qs[this.page].options[i].i) {
                    if (myAnswer === -1) {
                        myAnswer = i + 1
                    } else {
                        alert('複数の選択肢が選ばれています')
                        hasError = true
                        break
                    }
                }
            }
            if (!hasError) {
                if (myAnswer === -1) {
                    alert('回答が選ばれていません')
                } else {
                    this.qs[this.page].myAnswer = myAnswer
                    if (myAnswer === this.qs[this.page].answer) {
                        this.qs[this.page].get = this.qs[this.page].point
                        this.qs[this.page].isShowAnswer = true
                    } else {
                        this.qs[this.page].get = 0
                        this.qs[this.page].isShowAnswer = true
                    }
                }
            }
        },
        displayAnswer() {
            this.qs[this.page].isShowAnswer = !this.qs[this.page].isShowAnswer
        },
        previousPage() {
            if (this.page > 0) {
                this.page--
            }
        },
        nextPage() {
            if (this.page < this.qs.length) {
                this.page++
            }
        },
        displayResult() {
            this.result = true
        }
    }
})