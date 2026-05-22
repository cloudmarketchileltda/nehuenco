"use client";

import Link from "next/link";
import { Utensils, Clock, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-verde-profundo text-vegetal mt-auto border-t border-salvia/20">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Brand description */}
          <div className="space-y-4 col-span-1 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="bg-salvia text-vegetal p-2 rounded-full shadow-md">
                <Utensils className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-tight text-white leading-tight">
                  Nehuenco
                </span>
                <span className="text-[10px] tracking-widest text-menta font-sans uppercase -mt-1 font-bold">
                  Restobar
                </span>
              </div>
            </div>
            <p className="text-sm text-pastel-green/85 max-w-sm leading-relaxed">
              Disfruta de la mejor comida rápida, colaciones tradicionales, especialidades y una excelente carta de vinos, cervezas y tragos.
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-salvia/10 hover:bg-salvia text-menta hover:text-white rounded-full transition-all"
                aria-label="Sintonízanos en Instagram"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-salvia/10 hover:bg-salvia text-menta hover:text-white rounded-full transition-all"
                aria-label="Síguenos en Facebook"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
            </div>
          </div>

          {/* Quick links & Hours */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-white">Horario de Atención</h3>
            <ul className="space-y-2.5 text-sm text-pastel-green/90">
              <li className="flex items-start gap-2">
                <Clock className="h-4.5 w-4.5 text-menta shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold">Lunes a Sábado</span>
                  <span className="text-xs">12:00 hrs — 22:00 hrs</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="h-4.5 w-4.5 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-gray-300">Domingos y Feriados</span>
                  <span className="text-xs text-gray-400">Cerrado por descanso</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-white">Contacto</h3>
            <ul className="space-y-3 text-sm text-pastel-green/90">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4.5 w-4.5 text-menta shrink-0 mt-0.5" />
                <span>Calle Comercio 456, Cunco, Región de La Araucanía</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4.5 w-4.5 text-menta shrink-0" />
                <span>+56 2 2345 6789</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom credits */}
        <div className="mt-12 pt-8 border-t border-salvia/10 flex flex-col sm:flex-row items-center justify-between text-xs text-pastel-green/60">
          <p>© {new Date().getFullYear()} Restobar Nehuenco. Todos los derechos reservados.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <Link href="/catalog" className="hover:underline hover:text-white">Nuestra Carta</Link>
            <Link href="/profile" className="hover:underline hover:text-white">Club de Puntos</Link>
            <Link href="/admin" className="hover:underline hover:text-white">Administración</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
