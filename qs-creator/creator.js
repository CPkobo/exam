/**
 * 問題用のDataを作ります
 * @param {string} subtitle - 問題の標題。第一問など
 * @param {string} problem - 問題文
 * @param {boolean} isSelectCorrect - 正しいものを答える場合は true 謝っているものを答える場合は false
 * @param {number} point - 配点
 * @param {number} answer - 正答。１以上かつ選択肢の数以下の数字
 * @param {string} explain - 答えの解説文。
 * @param {string[]} options - 選択肢の配列
 * @return {object} - question
**/
function createQuestion(subtitle, problem, isSelectCorrect, point, answer, explain, options) {
    const options_ = []
    for (const opt of options) {
        if(opt === '') {
            continue
        }
        options_.push({
            t: opt,
            c: false,
            i: false
        })
    } 
    return {
        subtitle,
        problem,
        isSelectCorrect,
        isShowAnswer: false,
        point,
        get: -1,
        answer,
        explain,
        myAnswer: 0,
        options: options_
    }
}

/**
 * 問題用のDataをまとめて作ります
 * @param {string} text - 問題の元となる文字列。平文またはtsv
 * @param {string} isTsv - textが平文なら false、tsvなら true
 * @return {object} - questionの配列
**/
function batchCreateQuestions(text, isTsv) {
    const questionSeparator = isTsv ?  '\n' : '###'
    const contentsSeparator = isTsv ?  '\t' : '\n'
    const blocks = text.split(questionSeparator)
    const qs = []
    for (const block of blocks.slice(1)) {
        if (block === '') {
            continue
        }
        const qt = block.split(contentsSeparator)
        qs.push(createQuestion(
            qt[1],
            qt[2],
            qt[3] === '○',
            Number(qt[4]),
            Number(qt[5]),
            qt[6],
            qt.slice(7)
        ))
    }
    return qs
}

function createExam(path, title, isTsv) {
    const fs = require('fs')
    const contnts = fs.readFileSync(path).toString()
    const exam = {
        title,
        page: 0,
        hasComplete: false,
        result: false,
        qs:batchCreateQuestions(contents, isTsv)
    }
    return exam
}

// const q = createQuestion('1', 'test', true, 1, 1, 'testing', ['yes', 'no', 'ham'])
// console.log(q)

const testText = `
###
【第1問】
固定資産評価証明書の取り寄せに関して，次のうち，日弁連統一形式の用紙で請求する際の使用目的に含まれていないものはどれか。 
✖︎
1
1

家事審判申立て
民事訴訟提起
不動産仮処分申立て
借地非訟申立て
###
【第2問】
訴状の当事者の表示に関する下記の記述のうち適切でないものはどれか。
✖︎
1
3

当事者の住所は，現住所と住民票上の住所が異なっている場合は現住所を記載するが，将来の 強制執行等のためには住民票上の住所も併記した方がよい。
当事者が会社の場合は，会社の本店所在地と商号及び代表者を記載するが，代表者が代表取締 役で複数いる場合は，そのうちの誰か1人を記載すればよい。
当事者が未成年者で，父母両方が親権者となっている場合は，法定代理人親権者として，父母 のうちどちらか1人を記載すればよい。
当事者に通称があり通称名も記載する場合は，「〇〇(通称)こと〇〇〇〇」と表示すること ができる。
###
【第3問】
民事訴訟の訴状に添付する当事者の資格証明書について，誤っているものはどれか。
✖︎
1
1

会社が当事者の場合は，代表者の資格証明書として会社の登記事項証明書を添付する。
未成年者が当事者の場合は，親権者の資格証明書として住民票を添付する。
当事者が権利能力なき社団の場合は，登記がないので，代表者の資格証明書として，規約，寄付行為，議事録等を添付する。
市が当事者の場合には，代表者として市長を記載するが，資格証明書は必要ない。
`

const fs = require('fs')
const qs = batchCreateQuestions(testText, false)
console.log(qs)
console.log(qs.length)