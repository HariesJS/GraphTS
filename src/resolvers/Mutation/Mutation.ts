import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { MutationCreateUserArgs, MutationDeleteUserArgs, MutationEditUserArgs, MutationLoginArgs, MutationRegisterArgs } from "../../generated/graphql"
import User from "../../models/User"
import { subscribers } from '../Subscription/subscribers'

export const Mutation = {
    createUser: async (_: unknown, { name, age }: MutationCreateUserArgs) => {
        const data = await User.findOne({ name })

        if (data) {
            throw new Error('User exist')
        }

        const user = new User({
            name,
            age
        })

        await user.save()
        subscribers.forEach((fn: () => void) => fn())
        return user
    },
    deleteUser: async (_: unknown, { id }: MutationDeleteUserArgs) => {
        const data = await User.findById(id)

        if (!data) {
            throw new Error('DELETE ERROR: User not found;')
        }

        return await User.findByIdAndDelete(id)
    },
    async editUser(_: unknown, { id, name, age }: MutationEditUserArgs) {
        const data = await User.findById(id)

        if (!data) {
            throw new Error('PUT ERROR: User not found.')
        }

        return await User.findByIdAndUpdate(
            id,
            {
                $set: {
                    name,
                    age,
                }
            },
            {
                new: true,
            }
        )
    },
    async register(_: unknown, { name, password, age }: MutationRegisterArgs) {
        const data = await User.findOne({ name })

        if (data) {
            throw new Error('Username already exist :(')
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = new User({
            name,
            password: hashedPassword,
            age
        })

        await user.save()
        subscribers.forEach((fn: () => void) => fn())
        return user
    },
    login: async function(_: unknown, { name, password }: MutationLoginArgs) {
        const user = await User.findOne({ name })

        if (!user) {
            throw new Error('Invalid login :(')
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
            throw new Error('Invalid Login ;(')
        } //

        const token = jwt.sign(
            {
                id: user.id,
                name: user.name,
            },
            process.env.MONGODB_SECRET || '',
            {
                expiresIn: '30d'
            }
        )

        return {
            token,
            user
        }
    }
}