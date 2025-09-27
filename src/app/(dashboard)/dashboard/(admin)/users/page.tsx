// app/dashboard/users/page.tsx
"use client";

import { UsersList } from "@/components/user/UsersList";

export default function UsersPage() {
  return (
    <div className="p-6">
      <UsersList />
    </div>
  );
}
