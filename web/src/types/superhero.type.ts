export type SuperheroImage = {
    id: string
    imagePath: string
    superheroId?: string | null
}

export type Superhero = {
    id: string
    nickname: string
    realName: string
    originDescription: string
    superpowers: string[]
    catchPhrase: string
    images: SuperheroImage[]
    createdAt: string
}

export type CreateSuperheroDto = {
    nickname: string
    realName: string
    originDescription: string
    superpowers: string[]
    catchPhrase: string
    images: string[]
}

export type UpdateSuperheroDto = Partial<CreateSuperheroDto>
