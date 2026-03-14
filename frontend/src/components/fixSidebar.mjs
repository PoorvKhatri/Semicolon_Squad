import fs from 'fs';
const file = 'c:/Users/kpoor/OneDrive/Documents/GitHub/Semicolon_Squad/frontend/src/components/Sidebar.tsx';
let f = fs.readFileSync(file, 'utf8');

f = f.replace('BarChart2,', 'BarChart2,\n  User,');

f = f.replace(
  '<div className="mt-auto border-t border-white/10 pt-4">',
  `<div className="mt-auto border-t border-white/10 pt-4 flex flex-col gap-1">
          <Link
            to="/profile"
            className="group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
          >
            <User size={18} />
            {!collapsed && <span>My Profile</span>}
          </Link>`
);

fs.writeFileSync(file, f);
console.log("Done");
