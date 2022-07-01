import { QueryUserArgs, User as UserType } from "../../generated/graphql";
import Car from "../../models/Car";
import User from "../../models/User";

export const Query = {
    info: () => 'info2',
    users: () => User.find({}),
    user: async function (_: unknown, { id }: QueryUserArgs) {
        const user = await User.findById(id)
        if (!user) {
            throw new Error('User not found!')
        }
        return user
    },
    cars() {
        return Car.find({})
    },
    currentUser: async (_: unknown, args: unknown, { user }: { user: UserType }) => {
        if (!user) {
            throw new Error('Authorization token has depricated.')
        }

        return await User.findById(user.id)
    }
}