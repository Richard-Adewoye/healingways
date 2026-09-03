import { Suspense } from 'react';
import PatientLoginForm from './PatientLoginForm';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  return (
    <main>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          </div>
        }
      >
        <PatientLoginForm />
      </Suspense>
    </main>
  );
}