'use strict'

/**
 * Using Genetic Algorithm to generate lots of random strings
 * and make them evolve towards the target string.
 *
 */

const Genea = require('./Genea')
const alphabetArr = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ., '.split('')
const alphabet = (() => {
  const alphabet = {}
  alphabetArr.forEach((ch, i) => {
    alphabet[ch] = i
  })
  return alphabet
})()

function getTargetStr (targetStr) {
    var binaryStr = ''
    for (var i = 0 , len = targetStr.length; i < len; i++) {
      const ch = targetStr[i]
      const chIndex = alphabet[ch]
      binaryStr += paddingWith0((Number(chIndex).toString(2)))
    }
    return binaryStr
}

function paddingWith0 (num) {
    while (num.length < 6) {
        num = '0' + num
    }
    return num
}

function run (str) {
    var tar = getTargetStr(str)
    const ga = new Genea({
      geneLength: tar.length,
      mutateProbability: 0.5,
      doneFitness: 1,
      populationSize: 20,
      generationsSize: 400,
      getFitness: function(gene) {
        var count = 0
        for (var i = 0, len = gene.length; i < len; i++) {
            if (gene[i] === tar[i]) count++
        }
        const likeness = count / tar.length
        return likeness
      },
      onGeneration: function(generation, genes) {
        var max = 0, index = 0;
        this.fitnesses.forEach(function (fitness, i) {
          if (fitness > max) {
            max = fitness
            index = i
          }
        })
        this.history.push(toChars(genes[index]))
      }
    })

    ga.history = []
    ga.start()
    return ga
}

function toChars (gene) {
    var str = ''
    while (gene.length) {
        var ch = '00' + gene.substr(0, 6)
        gene = gene.substr(6)
        var chIndex = parseInt(ch, 2)
        if (chIndex >= alphabetArr.length) {
          chIndex = Math.floor(Math.random() * (alphabetArr.length - 1))
        }
        if (!alphabetArr[chIndex]) console.log(chIndex, parseInt(ch, 2))
        str += alphabetArr[chIndex]
    }
    return str
}

module.exports = run
