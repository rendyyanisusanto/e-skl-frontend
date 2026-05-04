<template>
  <div class="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-800 selection:bg-indigo-100">
    <!-- Navbar -->
    <header class="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 flex items-center justify-center">
            <img src="/logo.png" alt="Logo" class="w-full h-full object-contain drop-shadow-md" />
          </div>
          <div>
            <h1 class="font-extrabold text-xl text-slate-800 tracking-tight leading-none">E-SKL Digital</h1>
            <p class="text-xs text-slate-500 font-medium mt-0.5 tracking-wide uppercase">Portal Kelulusan</p>
          </div>
        </div>
        <div class="hidden sm:block">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
            Sistem Aktif & Aman
          </span>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow flex flex-col">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-slate-200 py-10 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:flex md:items-center md:justify-between">
        <p class="text-sm font-medium text-slate-500">&copy; {{ new Date().getFullYear() }} E-SKL Digital. Hak Cipta Dilindungi.</p>
        <p class="text-sm text-slate-400 mt-3 md:mt-0 flex items-center justify-center gap-1">
          Dibangun dengan <svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path></svg> untuk pendidikan
        </p>
      </div>
    </footer>
  </div>
</template>
