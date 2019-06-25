const httpsLocalhost = require('https-localhost')
const express = require('express')
const easymidi = require('easymidi')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const WebSocket = require('ws')

const inputs = easymidi.getInputs();
console.log(inputs)

const outputs = easymidi.getOutputs();
console.log(outputs)

// const input = new easymidi.Input('Launchkey Mini 24:0')
const output = new easymidi.Output('Driver IAC Bus 1')

app
    .prepare()
    .then(() => {
        const server = express()

        server.get('*', (req, res) => {
            return handle(req, res)
        })

        server.listen(3000, err => {
            if (err) throw err
            console.log('> Ready on http://localhost:3000')
        })

        // server.listen(3001)

        const wss = new WebSocket.Server({ port: 3001, server: server, path: "/test" })

        wss.on('connection', (ws) => {
            console.log('ok form server')
            ws.on('message', (msg) => {
                output.send('noteon', {
                    note: parseInt(msg),
                    velocity: 127,
                    channel: 0
                });
                console.log(msg)
            })
            // input.on('cc', (msg) => {
            //     console.log(msg)
            //     ws.send(msg.value)
            // })
        })
    })
    .catch(ex => {
        console.error(ex.stack)
        process.exit(1)
    })
