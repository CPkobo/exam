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
function createQuestion(subtitle, problem, point, answer, explain, options) {
    const options_ = []
    for (const opt of options) {
        if(opt === '') {
            continue
        }
        options_.push({
            t: opt,
            c: false,
            i: false,
            s: false,
        })
    } 
    return {
        subtitle,
        problem,
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
 * @param {string} text - 問題の元となる文字列。TSVから読み込んだもの
 * @return {object} - questionの配列
**/
function batchCreateQuestions(text) {
    const blocks = text.split('\n')
    const qs = []
    for (const block of blocks.slice(1)) {
        if (block === '') {
            continue
        }
        const qt = block.split('\t')
        qs.push(createQuestion(
            qt[0],
            qt[1],
            Number(qt[2]),
            Number(qt[3]),
            qt[4],
            qt.slice(5)
        ))
    }
    return qs
}

function createExam(path, title, isWriteFile) {
    const fs = require('fs')
    const contents = fs.readFileSync(path).toString()
    const exam = {
        title,
        page: 0,
        hasComplete: false,
        result: false,
        qs:batchCreateQuestions(contents)
    }
    if (isWriteFile) {
        const examText = JSON.stringify(exam, null, 2)
        fs.writeFileSync(`./${title}.json`, examText)
        fs.writeFileSync(`./${title}.js`, `const data = ${examText}`)
        return `File "./${title}.json" has been writen successfully with ${exam.qs.length} rows`
    } else {
        console.log(`"${title}" has been read successfully with ${exam.qs.length} rows`)
        return exam
    }
}

// const qs = batchCreateQuestions(testText, false)
// const isWriteFile = true
// const result = createExam('./10.txt', '10', isWriteFile)
// if (!isWriteFile) {
//     console.log(result)
// }
createExam('./7.txt', '第７回事務職員能力認定試験', true)