import { Mppx, tempo } from 'mppx/nextjs'

export const mppx = Mppx.create({
  methods: [
    tempo.charge({
      currency: process.env.CURRENCY_ADDRESS as `0x${string}`,
      recipient: process.env.RECIPIENT_ADDRESS as `0x${string}`,
    }),
  ],
  realm: 'agentsfindjobs',
})
