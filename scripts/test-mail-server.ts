// Test-only SMTP inbox. Bound to loopback and never included in the runtime image.
import { SMTPServer } from 'smtp-server';
import { createServer } from 'node:http';
const messages: { to: string[]; raw: string }[] = [];
const smtp = new SMTPServer({
  authOptional: true, disabledCommands: ['AUTH', 'STARTTLS'],
  onData(stream, session, callback) {
    let raw = '';
    stream.on('data', chunk => { raw += chunk.toString(); });
    stream.on('end', () => {
      messages.push({ to: session.envelope.rcptTo.map(item => item.address), raw });
      if (messages.length > 100) messages.shift();
      callback();
    });
  },
});
smtp.listen(1026, '127.0.0.1');
createServer((_request, response) => { response.setHeader('Content-Type', 'application/json'); response.end(JSON.stringify(messages)); }).listen(8026, '127.0.0.1');
console.log('Test mailbox listening on loopback ports 1026 and 8026');
