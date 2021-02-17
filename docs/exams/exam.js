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
    created() {
        const que = window.location.search
        if (que === '?restart') {
            this.clearState()
        } else {
            this.loadState()
        }
    },
    methods: {
        backToIndex() {
            this.saveState()
        },
        saveState() {
            const data = {
                title: this.title,
                page: this.page,
                hasComplete: this.hasComplete,
                result: this.result,
                qs: this.qs
            }
            window.localStorage.setItem('state', JSON.stringify(data))
        },
        loadState() {
            const state = window.localStorage.getItem('state')
            if (state !== null) {
                const data = JSON.parse(state)
                this.title = data.title
                this.page = data.page
                this.hasComplete = data.hasComplete
                this.result = data.result
                this.qs = data.qs
            }
        },
        clearState() {
            window.localStorage.removeItem('state')
        },
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
                opt.s = false
            }
        },
        selectAnswer(opx, outofCk) {
            for (let i = 0; i < this.qs[this.page].options.length; i++) {
                if (i === opx) {
                    if (outofCk) {
                        this.qs[this.page].options[i].s = !this.qs[this.page].options[i].s
                    }
                    this.qs[this.page].myAnswer = this.qs[this.page].options[i].s ? i + 1 : 0
                } else {
                    this.qs[this.page].options[i].s = false
                }
            }
        },
        answer() {
            if (this.qs[this.page].myAnswer === 0) {
                alert('回答が選ばれていません')
            } else {
                if (this.qs[this.page].myAnswer === this.qs[this.page].answer) {
                    this.qs[this.page].get = this.qs[this.page].point
                    this.qs[this.page].isShowAnswer = true
                } else {
                    this.qs[this.page].get = 0
                    this.qs[this.page].isShowAnswer = true
                }
                if (this.page === this.qs.length - 1) {
                    this.hasComplete = true
                }
                this.saveState()
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
        },
        backToProblem(qx) {
            this.result = false
            this.page = qx
        }
    }
})