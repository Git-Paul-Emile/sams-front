import { useState } from "react";
import { AtSign, Bell, MessageSquare } from "lucide-react";
import { useEmailNotifs, useMarkNotificationRead, useNotifications, useWhatsAppNotifs } from "../hooks/useNotificationsQueries";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifTab, setNotifTab] = useState<"interne" | "email" | "whatsapp">("interne");
  const { data: notifs = [] } = useNotifications();
  const { data: emailNotifs = [] } = useEmailNotifs();
  const { data: whatsappNotifs = [] } = useWhatsAppNotifs();
  const markRead = useMarkNotificationRead();
  const unread = notifs.filter((n) => !n.lu).length;

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2 rounded-lg hover:bg-muted transition-colors">
        <Bell className="w-4 h-4 text-muted-foreground" />
        {unread > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{unread}</span>}
      </button>
      {open && (
        <div className="absolute right-0 top-11 w-96 bg-card border border-border rounded-2xl shadow-2xl z-40 overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <p className="font-bold text-sm">Centre de notifications</p>
            <div className="flex gap-1 mt-2">
              {(["interne", "email", "whatsapp"] as const).map((t) => (
                <button key={t} onClick={() => setNotifTab(t)} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${notifTab === t ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-slate-200"}`}>
                  {t === "interne" ? "ERP" : t === "email" ? "Email" : "WhatsApp"}
                </button>
              ))}
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto divide-y divide-border">
            {notifTab === "interne" && notifs.map((n) => (
              <div key={n.id} className={`px-4 py-3 ${!n.lu ? "bg-blue-50/50" : ""}`} onClick={() => markRead.mutate(n.id)}>
                <div className="flex items-start gap-2 cursor-pointer">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.type === "alerte" ? "bg-red-500" : n.type === "validation" ? "bg-amber-500" : n.type === "production" ? "bg-blue-500" : "bg-emerald-500"}`} />
                  <div className="min-w-0"><p className="text-xs font-semibold">{n.titre}</p><p className="text-xs text-muted-foreground mt-0.5">{n.msg}</p><p className="text-[10px] text-muted-foreground/70 mt-1">{n.heure}</p></div>
                </div>
              </div>
            ))}
            {notifTab === "email" && emailNotifs.map((e) => (
              <div key={e.id} className="px-4 py-3 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0"><AtSign className="w-3.5 h-3.5 text-blue-600" /></div>
                <div className="min-w-0 flex-1"><p className="text-xs font-medium text-foreground truncate">{e.sujet}</p><p className="text-[10px] text-muted-foreground mt-0.5">À: {e.to}</p><div className="flex items-center justify-between mt-1"><p className="text-[10px] text-muted-foreground/70">{e.heure}</p><span className="text-[10px] text-emerald-600 font-medium">{e.statut}</span></div></div>
              </div>
            ))}
            {notifTab === "whatsapp" && whatsappNotifs.map((w) => (
              <div key={w.id} className="px-4 py-3 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0"><MessageSquare className="w-3.5 h-3.5 text-emerald-600" /></div>
                <div className="min-w-0 flex-1"><p className="text-xs text-foreground">{w.msg}</p><p className="text-[10px] text-muted-foreground mt-1">Vers: {w.to} · {w.heure}</p></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
