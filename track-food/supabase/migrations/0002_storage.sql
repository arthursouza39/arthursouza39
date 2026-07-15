-- ============================================================================
-- Storage: bucket privado para fotos de cardápio e nota fiscal.
-- Estrutura de pastas: <restaurante_id>/<tipo>/<arquivo>
-- O acesso é liberado apenas ao dono do restaurante (primeira pasta = id).
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('fotos', 'fotos', false)
on conflict (id) do nothing;

create policy "fotos_leitura_do_dono" on storage.objects
  for select using (
    bucket_id = 'fotos'
    and public.eh_dono_do_restaurante((storage.foldername(name))[1]::uuid)
  );

create policy "fotos_upload_do_dono" on storage.objects
  for insert with check (
    bucket_id = 'fotos'
    and public.eh_dono_do_restaurante((storage.foldername(name))[1]::uuid)
  );

create policy "fotos_delete_do_dono" on storage.objects
  for delete using (
    bucket_id = 'fotos'
    and public.eh_dono_do_restaurante((storage.foldername(name))[1]::uuid)
  );
