export class TokenList {
  #tokens = $state<string[]>([])

  add(token: string) {
    if (token.length === 0) {
      throw new SyntaxError('Token cannot be empty')
    }
    if (token.match(/\s/)) {
      throw new SyntaxError('Token cannot contain whitespaces')
    }
    if (!this.contains(token)) {
      this.#tokens = [...this.#tokens, token]
    }
  }

  remove(token: string) {
    this.#tokens = [...this.#tokens.filter((t) => t !== token)]
  }

  contains(token: string) {
    return this.#tokens.includes(token)
  }

  values() {
    return this.#tokens
  }

  toggle(token: string, force?: boolean) {
    const shouldAdd = force ?? !this.contains(token)
    shouldAdd ? this.add(token) : this.remove(token)
  }
}
