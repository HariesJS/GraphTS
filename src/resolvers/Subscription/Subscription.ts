import { onSubscribe } from "./subscribers"
import { PubSubEngine } from 'graphql-subscriptions/dist/pubsub-engine'
import User from "../../models/User"

export const Subscription = {
    users: {
        subscribe: (_: unknown, args: unknown, { pubsub }: { pubsub: PubSubEngine }) => {
            const channel = 'USERS_CHANNEL'
            onSubscribe(() => pubsub.publish(channel, { users: User.find({}) }))
            setTimeout(() => pubsub.publish(channel, { users: User.find({}) }), 0)

            return pubsub.asyncIterator(channel) // await 
        }
    }
}