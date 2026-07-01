import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export default function ApiDocsPage() {
  return (
    <section className="p-8 bg-page min-h-screen">
      <h1 className="text-3xl font-bold text-primary mb-6">Documentação da API – AptusClin</h1>
      <SwaggerUI
        url="/swagger.yaml"
        docExpansion="none"
        persistAuthorization={true}
        requestInterceptor={(req) => {
          // Forward cookies (supersession) for authenticated API calls
          if (typeof document !== 'undefined') {
            const cookies = document.cookie;
            if (cookies) req.headers.cookie = cookies;
          }
          return req;
        }}
      />
    </section>
  );
}
