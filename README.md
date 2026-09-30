# Worbee workspace builder

An interactive furniture workspace planner. Choose a desk and chair, add compatible accessories, and review the estimated monthly total before sending an enquiry.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Run the test suite with `npm test`, lint with `npm run lint`, and create a production build with `npm run build`.

## Enquiry delivery

The enquiry form posts to the app's `/api/enquiries` route. Set these server-only variables in `.env.local` or the deployment environment to forward enquiries to an HTTPS endpoint:

```dotenv
ENQUIRY_ENDPOINT=https://your-service.example/enquiries
ENQUIRY_API_KEY=your-server-side-secret
```

The API key is optional and is sent as a Bearer token. The route validates submitted contact details and product quantities, then computes prices from the app catalogue before forwarding the request. No provider or endpoint is configured by default; the form reports a clear unavailable message until one is set.

The workspace draft is stored locally in the current browser. It is not sent until the user submits the enquiry.
