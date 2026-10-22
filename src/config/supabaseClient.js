import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://lrjumrqjpepxmlwaiwvq.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_J_3CPWfSss-0HwGGUD5bhw_W9oyl238';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

// SQL Setup script ready to be executed in Supabase SQL Editor
export const SUPABASE_INIT_SQL = `-- ==============================================================================
-- FORHER BEAUTY & SPA - SUPABASE DATABASE INITIALIZATION SCRIPT
-- Chạy đoạn script này tại: Supabase Dashboard > SQL Editor > New query > Run
-- ==============================================================================

-- 1. Bảng Đơn Đặt Lịch (Bookings)
CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    service_id TEXT,
    service_name TEXT NOT NULL,
    category_name TEXT,
    mode_label TEXT,
    price_display TEXT,
    booking_date DATE NOT NULL,
    booking_time TEXT NOT NULL,
    skin_notes TEXT,
    admin_notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_by TEXT DEFAULT 'Khách hàng',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Bảng Tài Khoản Quản Trị & Nhân Viên (Staff & Boss Accounts)
CREATE TABLE IF NOT EXISTS public.staff_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'staff', -- 'boss' | 'staff'
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Bảng Lịch Sử Thao Tác (Audit Logs)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id TEXT PRIMARY KEY,
    action TEXT NOT NULL,
    action_title TEXT NOT NULL,
    actor TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    details TEXT,
    order_id TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Bảng Chấm Công Nhân Viên (Staff Attendance)
CREATE TABLE IF NOT EXISTS public.staff_attendance (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    staff_name TEXT NOT NULL,
    date DATE NOT NULL,
    check_in_time TEXT NOT NULL,
    check_out_time TEXT,
    status TEXT NOT NULL DEFAULT 'working', -- 'working' | 'completed' | 'leave'
    working_hours NUMERIC,
    shift_name TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bổ sung cột nhân viên phụ trách vào bookings (nếu chưa có)
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS assigned_staff TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS assigned_staff_name TEXT;

-- Khởi tạo tài khoản Sếp 'admin' mặc định nếu chưa có
INSERT INTO public.staff_accounts (username, password, full_name, role)
VALUES ('admin', 'forheradmin', 'Sếp / Quản Lý Tối Cao', 'boss')
ON CONFLICT (username) DO NOTHING;

-- Phân quyền cho Publishable / Anon Key thao tác
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_attendance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anon on bookings" ON public.bookings;
CREATE POLICY "Allow anon on bookings" ON public.bookings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon on staff_accounts" ON public.staff_accounts;
CREATE POLICY "Allow anon on staff_accounts" ON public.staff_accounts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon on audit_logs" ON public.audit_logs;
CREATE POLICY "Allow anon on audit_logs" ON public.audit_logs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon on staff_attendance" ON public.staff_attendance;
CREATE POLICY "Allow anon on staff_attendance" ON public.staff_attendance FOR ALL USING (true) WITH CHECK (true);
`;
