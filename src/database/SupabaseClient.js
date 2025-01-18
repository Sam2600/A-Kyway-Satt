import { createClient } from "@supabase/supabase-js";
import { DB_CONSTS } from "../constants/const.db.js"

export const supabase = createClient(DB_CONSTS?.supabase_prj_url, DB_CONSTS?.supabase_prj_key);