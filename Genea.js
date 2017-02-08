'use strict'

class Genea {
  constructor(config) {
    this.currentGeneration = 0
    this.populations = []
    this.fitnesses = []

    this.mutateProbability = config.mutateProbability || 0.5 // 0 ~ 1
    this.generationsSize = config.generationsSize || 100
    this.populationSize = config.populationSize || 100
    this.doneFitness = config.doneFitness || 1 // 0 ~ 1

    this.geneLength = config.geneLength
    this.getFitness = config.getFitness

    this.outOfGenerationsSize = config.outOfGenerationsSize || this.outOfGenerationsSize
    this.onGeneration = config.onGeneration || this.onGeneration
    this.done = config.done || this.done
  }

  start() {
    this.initPopulation()
    this.makeFitnesses()
    this.select()
  }

  initPopulation() {
    this.currentGeneration = 1
    this.populations = []
    for (let i = 0, len = this.populationSize; i < len; i++) {
      let gene = getRandomGene(this.geneLength)
      this.populations.push(gene)
    }
    this.onGeneration(this.currentGeneration, this.populations)
  }

  select() {
    if (this.currentGeneration >= this.generationsSize) {
      return this.outOfGenerationsSize(this.populations, this.fitnesses)
    }
    let matches = this.getMatches()
    if (matches.length > 0) return this.done(matches)
    this.generateNextGeneration()
  }

  makeFitnesses() {
    this.fitnesses = []
    this.totalFitness = 0
    this.populations.forEach((individual, i) => {
      let fitness = this.getFitness(individual, this.populations)
      this.fitnesses[i] = fitness
      this.totalFitness += fitness
    })
  }

  getMatches() {
    let bests = []
    this.populations.forEach((individual, i) => {
      let fitness = this.fitnesses[i]
      if (fitness >= this.doneFitness) {
        bests.push({
          gene: individual,
          fitness: fitness,
          pos: i
        })
      }
    })
    return bests
  }

  generateNextGeneration() {
    this.currentGeneration++
    let oldPopulations = this.populations
    let newPopulations = []
    for (var i = 0, len = oldPopulations.length; i < len; i++) {
      let father = this.rotate()
      let mother = this.rotate()
      let child = this.crossOver(father, mother)
      child = this.mutate(child)
      newPopulations.push(child)
    }
    this.populations = newPopulations
    this.makeFitnesses()
    this.onGeneration(this.currentGeneration, this.populations)
    this.select()
  }

  crossOver(father, mother) {
    let pos = Math.floor(father.length * Math.random())
    let child1 = father.substring(0, pos) + mother.substring(pos)
    let child2 = mother.substring(0, pos) + father.substring(pos)
    return this.getFitness(child1) > this.getFitness(child2)
      ? child1
      : child2
  }

  mutate(child) {
    let mutateProbability = Math.random()
    if (mutateProbability < this.mutateProbability) return child
    let pos = Math.floor(Math.random() * this.geneLength)
    let arr = child.split("")
    arr[pos] = +child[pos] ^ 1
    return arr.join("")
  }

  rotate() {
    let pos = Math.random() // let's roll!
    let soFar = 0
    for(let i = 0, len = this.fitnesses.length; i < len; i++) {
      let fitness = this.fitnesses[i]
      soFar += fitness
      if (soFar / this.totalFitness >= pos) {
        return this.populations[i]
      }
    }
  }

  done() {}
  onGeneration() {}
  outOfGenerationsSize() {}
}

function getRandomGene(len) {
  let gene = ""
  for(let i = 0; i < len; i++) {
    gene += ((Math.floor(Math.random() * 100)) % 2 === 0)
      ? "1"
      : "0"
  }
  return gene
}

module.exports = Genea
