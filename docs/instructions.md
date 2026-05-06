# Proyecto Invoxa: Sistema de generación de facturas para Informage Studios

## 1. Descripción general

El objetivo del proyecto es construir una aplicación interna para Informage Studios que permita gestionar colaboradores, proyectos, modalidades de pago y generación de facturas mensuales.

La aplicación permitirá que un administrador invite usuarios, configure su proyecto inicial, modalidad de pago y datos básicos. Luego, cada usuario podrá completar o ajustar su información, registrar tareas si cobra por hora, y generar su factura mensual con un formato base.

El administrador podrá solicitar facturas de forma individual o masiva al cierre de cada mes mediante correo electrónico. Cada usuario recibirá una notificación para generar su factura correspondiente.

El sistema deberá generar facturas con número consecutivo, fecha, datos del usuario, detalles del pago, observaciones y un formato estandarizado para Informage Studios.

El stack principal será:

- Frontend: React.js
- Aplicación móvil/nativa: Capacitor
- Backend: Supabase
- Base de datos: PostgreSQL vía Supabase
- Autenticación: Supabase Auth
- Storage: Supabase Storage para PDFs de facturas
- Edge Functions: Supabase Edge Functions para generación de correos, PDFs y lógica backend sensible

---

## 2. Objetivos principales

### Objetivo general

Crear una plataforma interna para gestionar y automatizar el proceso mensual de solicitud, creación y almacenamiento de facturas de colaboradores de Informage Studios.

### Objetivos específicos

- Permitir que el administrador invite usuarios al sistema.
- Asignar inicialmente a cada usuario un proyecto.
- Definir la modalidad de pago de cada usuario:
  - Pago por hora.
  - Pago fijo mensual.
- Permitir que el usuario ajuste ciertos datos personales o de facturación.
- Permitir el registro de tareas para usuarios con pago por hora.
- Generar facturas mensuales con formato base.
- Generar consecutivos únicos de factura.
- Permitir observaciones generales en la factura.
- Permitir al administrador solicitar facturas por correo de forma individual o masiva.
- Almacenar el historial de facturas generadas.
- Permitir descarga o visualización de facturas en PDF.
- Preparar la base para uso web y aplicaciones nativas mediante Capacitor.

---

## 3. Roles del sistema

### Admin

El administrador tiene acceso a la gestión general del sistema.

Funciones principales:

- Invitar usuarios.
- Crear, editar y desactivar usuarios.
- Asignar usuarios a proyectos.
- Definir modalidad de pago inicial.
- Definir tarifa por hora o tarifa fija mensual.
- Ver listado de usuarios.
- Ver tareas registradas por usuarios.
- Ver facturas generadas.
- Solicitar facturas mensuales por correo.
- Enviar solicitud masiva de facturas.
- Enviar solicitud individual de factura.
- Aprobar, revisar o marcar facturas como recibidas.
- Descargar facturas.

### Usuario / Colaborador

El usuario es quien genera su factura mensual.

Funciones principales:

- Aceptar invitación y crear cuenta.
- Completar datos personales y de facturación.
- Ver su proyecto asignado.
- Ver o ajustar su modalidad de pago si está permitido.
- Registrar tareas si cobra por hora.
- Generar factura mensual.
- Agregar observaciones a la factura.
- Descargar factura generada.
- Ver historial de sus facturas.

---

## 4. Flujo general del sistema

### 4.1 Invitación de usuarios

1. El administrador crea una invitación para un nuevo usuario.
2. El admin registra:
   - Nombre.
   - Email.
   - Proyecto inicial.
   - Modalidad de pago.
   - Tarifa por hora o tarifa fija mensual.
   - Moneda.
3. El sistema envía una invitación por correo.
4. El usuario acepta la invitación.
5. El usuario completa su perfil.

### 4.2 Configuración del usuario

El usuario podrá completar o ajustar datos como:

- Nombre completo.
- Documento o identificación fiscal.
- Dirección.
- País.
- Ciudad.
- Email de facturación.
- Datos bancarios o método de pago.
- Información fiscal adicional.
- Observaciones predeterminadas para facturas.

Dependiendo de las reglas del negocio, algunos datos podrán ser bloqueados para edición directa y requerir aprobación del admin.

### 4.3 Usuarios con tarifa por hora

Si el usuario cobra por hora, tendrá un módulo para registrar tareas.

Cada tarea puede incluir:

- Nombre de la tarea.
- Descripción.
- Fecha.
- Cantidad de horas.
- Proyecto asociado.
- Observaciones.
- Estado.

Al final del mes, la factura se generará con base en la suma de horas registradas durante el periodo seleccionado.

Ejemplo:

```txt
Total horas del mes: 85
Tarifa por hora: 20 USD
Total a pagar: 1,700 USD
```

### 4.4 Usuarios con tarifa fija mensual


Si el usuario tiene tarifa fija mensual, no necesita registrar tareas para calcular el pago.

La factura se genera con base en la tarifa mensual configurada.

Ejemplo:

Tarifa fija mensual: 2,000 USD
Periodo: Marzo 2026
Total a pagar: 2,000 USD

Opcionalmente, el usuario podría agregar una descripción general del trabajo realizado durante el mes.

### 4.5 Solicitud mensual de facturas

Al final del mes, el administrador podrá:

- Enviar correo individual a un usuario solicitando su factura.
- Enviar correo masivo a todos los usuarios activos.
- Filtrar usuarios por proyecto.
- Filtrar usuarios por modalidad de pago.
- Filtrar usuarios que aún no han generado factura.

El correo debe incluir un enlace directo para que el usuario entre a la plataforma y genere su factura.

### 4.6 Generación de factura

El usuario podrá generar su factura mensual seleccionando el periodo correspondiente.

Un usuario puede participar en varios proyectos al mismo tiempo. La factura mensual es **única por usuario y periodo**, e incluye un desglose de ítems por cada proyecto en el que el usuario haya tenido actividad o tarifa activa durante el periodo.

El sistema deberá:

- Validar que el usuario tenga datos de facturación completos.
- Validar que no exista ya una factura para ese usuario y periodo, salvo que se permita regeneración.
- Identificar todos los proyectos activos del usuario durante el periodo.
- Calcular el monto por cada proyecto según la modalidad de pago configurada para esa asignación (puede haber proyectos por hora y proyectos fijos en la misma factura).
- Sumar todos los subtotales por proyecto en un total único.
- Generar un número consecutivo (ver sección 6).
- Crear el registro de factura en base de datos.
- Crear los `invoice_items` correspondientes, cada uno asociado a su `project_id`.
- Generar el PDF.
- Guardar el PDF en Supabase Storage.
- Permitir descarga al usuario y al admin.

### 4.7 Solicitud de cambio de número consecutivo

Tanto el admin como el usuario pueden solicitar el cambio del número consecutivo de una factura ya generada (por ejemplo, para corregir un error de numeración o alinear con un consecutivo externo).

Reglas:

- El admin puede cambiar el consecutivo de cualquier factura directamente.
- El usuario debe **solicitar** el cambio, indicando el nuevo número propuesto y un motivo. La solicitud queda en estado `pending` hasta que el admin la apruebe o rechace.
- Si el admin aprueba, el sistema valida que el nuevo número no rompa unicidad y actualiza la factura.
- Si el admin rechaza, debe registrar un motivo de rechazo.
- Todo cambio queda auditado en una tabla de historial.
  
## 5. Datos principales de la factura

Cada factura debe incluir como mínimo:

- Nombre o razón social del usuario.
- Documento o identificación fiscal.
- Dirección del usuario.
- Email.
- Lista de proyectos incluidos en la factura (uno o varios).
- Número de factura consecutivo.
- Fecha de emisión.
- Periodo facturado.
- Modalidad(es) de pago utilizadas (puede ser mixta si participa en varios proyectos).
- Detalles del pago.
- Moneda.
- Desglose por proyecto (subtotal por cada uno).
- Subtotal general.
- Impuestos, si aplica.
- Total.
- Observaciones.
- Datos de Informage Studios.
- Datos bancarios o información de pago del usuario.
- Estado de la factura.
## 6. Consecutivo de facturas

Cada factura deberá tener un número consecutivo único **por usuario**. Cada colaborador maneja su propia secuencia, independiente de los demás.

Formato sugerido (incluye identificador del usuario para evitar colisiones):

INF-{USER_CODE}-2026-0001
INF-{USER_CODE}-2026-0002
INF-{USER_CODE}-2026-0003

Donde `{USER_CODE}` puede ser:

- Iniciales del usuario (ej: `RCA`).
- Código corto asignado al crear la invitación.
- Identificador interno corto del perfil.

Otra alternativa, manteniendo formato simple si el código de usuario se gestiona por separado:

IS-2026-000001

Reglas:

- El consecutivo es único **por usuario** (cada colaborador tiene su propia secuencia).
- Debe generarse automáticamente al crear la factura.
- Debe evitar duplicados dentro de la secuencia del mismo usuario.
- Debe generarse desde backend usando una función segura en Supabase/PostgreSQL.
- No debe depender del frontend.

### 6.1 Cambio del consecutivo

El consecutivo puede modificarse después de generado bajo las siguientes reglas:

- El **admin** puede cambiar el consecutivo de cualquier factura directamente desde el panel de facturas.
- El **usuario** puede solicitar el cambio mediante el flujo descrito en la sección 4.7. La solicitud requiere aprobación del admin antes de aplicarse.
- Cualquier cambio (directo o aprobado) debe:
  - Validar que el nuevo número no exista ya en la secuencia del mismo usuario.
  - Registrar el cambio en una tabla de auditoría con: número anterior, número nuevo, quién lo solicitó, quién lo aprobó, fecha y motivo.
  - Mantener el PDF actualizado regenerando el archivo si es necesario.
## 7. Estados sugeridos de una factura

Una factura puede tener los siguientes estados:

- draft
- generated
- sent
- reviewed
- approved
- rejected
- paid
- cancelled

Descripción:

- draft: factura en borrador.
- generated: factura generada por el usuario.
- sent: factura enviada o notificada al admin.
- reviewed: revisada por el admin.
- approved: aprobada para pago.
- rejected: rechazada con observaciones.
- paid: pagada.
- cancelled: anulada.

## 8. Modelo de datos sugerido
Tabla: profiles

Extiende la información del usuario autenticado en Supabase Auth.

Campos sugeridos:

id uuid primary key references auth.users(id)
full_name text
email text
role text -- admin | user
status text -- active | inactive | invited
created_at timestamp
updated_at timestamp
Tabla: user_billing_profiles

Datos de facturación del usuario.

id uuid primary key
user_id uuid references profiles(id)
legal_name text
tax_id text
address text
city text
country text
billing_email text
bank_name text
bank_account text
payment_method text
default_invoice_notes text
created_at timestamp
updated_at timestamp
Tabla: projects

Proyectos de Informage Studios.

id uuid primary key
name text
description text
status text -- active | inactive
created_at timestamp
updated_at timestamp
Tabla: user_project_assignments

Relación entre usuarios y proyectos.

id uuid primary key
user_id uuid references profiles(id)
project_id uuid references projects(id)
is_current boolean
start_date date
end_date date
created_at timestamp
updated_at timestamp
Tabla: compensation_settings

Configuración de pago del usuario.

id uuid primary key
user_id uuid references profiles(id)
project_id uuid references projects(id)
payment_type text -- hourly | fixed
hourly_rate numeric
monthly_rate numeric
currency text -- USD, COP, EUR, etc.
is_active boolean
created_at timestamp
updated_at timestamp

Reglas:

Si payment_type = hourly, usar hourly_rate.
Si payment_type = fixed, usar monthly_rate.
Puede existir historial de cambios si se requiere auditoría.
Tabla: tasks

Tareas registradas por usuarios con pago por hora.

id uuid primary key
user_id uuid references profiles(id)
project_id uuid references projects(id)
name text
description text
task_date date
hours numeric
observations text
invoice_id uuid null references invoices(id)
created_at timestamp
updated_at timestamp

Reglas:

Solo aplica para usuarios con modalidad hourly.
Las tareas pueden estar sin factura hasta que se genere la factura mensual.
Una vez asociadas a una factura, deberían bloquearse o requerir permisos especiales para edición.
Tabla: invoices

Registro principal de facturas. Una factura es **única por usuario y periodo**, e incluye todos los proyectos en los que participó durante ese mes.

id uuid primary key
user_id uuid references profiles(id)
invoice_number text unique
user_invoice_sequence integer -- número correlativo dentro de la secuencia del usuario
invoice_date date
period_start date
period_end date
currency text
subtotal numeric
tax_amount numeric
total numeric
status text
notes text
pdf_url text
created_at timestamp
updated_at timestamp

Notas:

- Se elimina `project_id` de esta tabla porque una factura puede agrupar varios proyectos.
- Se elimina `payment_type` directo porque puede ser mixto (algunos ítems hourly, otros fixed). Cada ítem lleva su propio detalle.
- Constraint único sugerido: `(user_id, period_start, period_end)` cuando `status != 'cancelled'`.
- `user_invoice_sequence` permite mantener un consecutivo independiente por usuario y facilita reordenarlo si se aprueba un cambio.

Tabla: invoice_items

Detalle de ítems de la factura, agrupados por proyecto.

id uuid primary key
invoice_id uuid references invoices(id)
project_id uuid references projects(id) -- proyecto al que corresponde el ítem
payment_type text -- hourly | fixed
description text
quantity numeric
unit_price numeric
total numeric
created_at timestamp
updated_at timestamp

Ejemplos:

Factura mensual de un usuario que trabajó en 2 proyectos en marzo 2026:

Item 1 (Proyecto A - hourly):
  project_id: <uuid Proyecto A>
  payment_type: hourly
  Description: Development tasks - Project A - March 2026
  Quantity: 60
  Unit price: 20
  Total: 1200

Item 2 (Proyecto B - fixed):
  project_id: <uuid Proyecto B>
  payment_type: fixed
  Description: Monthly fixed compensation - Project B - March 2026
  Quantity: 1
  Unit price: 800
  Total: 800

Subtotal de la factura: 2000
Total: 2000
Tabla: invoice_requests

Solicitudes enviadas por el admin para pedir facturas.

id uuid primary key
requested_by uuid references profiles(id)
user_id uuid references profiles(id)
period_start date
period_end date
status text -- pending | completed | expired
sent_at timestamp
completed_at timestamp
created_at timestamp
updated_at timestamp
Tabla: email_logs

Registro de correos enviados.

id uuid primary key
recipient_email text
subject text
type text -- invitation | invoice_request | invoice_generated | invoice_number_change_request | invoice_number_change_resolved
status text -- pending | sent | failed
provider_response jsonb
created_at timestamp

Tabla: invoice_number_change_requests

Solicitudes de cambio del número consecutivo de una factura.

id uuid primary key
invoice_id uuid references invoices(id)
requested_by uuid references profiles(id)
requested_by_role text -- admin | user
current_invoice_number text
requested_invoice_number text
reason text
status text -- pending | approved | rejected | applied
reviewed_by uuid references profiles(id) null
reviewed_at timestamp null
review_notes text null
created_at timestamp
updated_at timestamp

Reglas:

- Si `requested_by_role = admin`, la solicitud puede crearse y aplicarse directamente (status pasa a `applied`).
- Si `requested_by_role = user`, la solicitud nace con status `pending` y queda esperando revisión del admin.
- Al aprobar (`approved`), una función backend valida unicidad y actualiza la factura, dejando la solicitud en `applied`.
- Al rechazar (`rejected`), se conserva el motivo en `review_notes`.

Tabla: invoice_number_history

Auditoría de todos los cambios aplicados al número consecutivo de una factura.

id uuid primary key
invoice_id uuid references invoices(id)
previous_invoice_number text
new_invoice_number text
change_request_id uuid references invoice_number_change_requests(id) null
changed_by uuid references profiles(id)
changed_at timestamp
reason text

Notas:

- Se debe insertar un registro cada vez que cambia `invoices.invoice_number`.
- `change_request_id` puede ser null cuando el admin cambia el número directamente sin solicitud previa.

## 9. Seguridad y permisos

El sistema debe usar Row Level Security de Supabase.

Reglas generales:

Admin

Puede:

- Ver todos los usuarios.
- Crear invitaciones.
- Editar proyectos.
- Ver lista de colaboradores asignados a cada proyecto.
- Asignar usuarios a uno o varios proyectos.
- Editar configuración de pago por usuario y por proyecto.
- Ver todas las tareas.
- Ver todas las facturas.
- Solicitar facturas.
- Cambiar estado de facturas.
- Cambiar directamente el consecutivo de cualquier factura.
- Aprobar o rechazar solicitudes de cambio de consecutivo enviadas por usuarios.

Usuario

Puede:

- Ver su propio perfil.
- Editar sus propios datos permitidos.
- Ver sus proyectos asignados (puede ser más de uno).
- Ver su configuración de pago por cada proyecto.
- Crear y editar sus propias tareas no facturadas.
- Generar su factura mensual unificada (incluye todos sus proyectos del periodo).
- Ver sus propias facturas.
- Descargar sus propios PDFs.
- **Solicitar** un cambio de consecutivo en sus propias facturas (la solicitud queda pendiente de aprobación del admin).
- Ver el estado de sus solicitudes de cambio de consecutivo.

No puede:

- Ver datos de otros usuarios.
- Cambiar su rol.
- Cambiar directamente el consecutivo de su factura (solo puede solicitarlo).
- Aprobar sus propias solicitudes de cambio de consecutivo.
- Aprobar o marcar facturas como pagadas.
- Modificar facturas de otros usuarios.
## 10. Arquitectura propuesta
Frontend

Aplicación React.js con rutas protegidas según rol.

Librerías sugeridas:

React
React Router
Supabase JS Client
React Hook Form
Zod
TanStack Query
date-fns
jsPDF, pdf-lib o generación PDF desde backend
Capacitor para apps nativas
Backend

Usar Supabase como backend principal:

Supabase Auth para autenticación.
Supabase PostgreSQL para datos.
Supabase Storage para PDFs.
Supabase Edge Functions para:
Enviar invitaciones.
Enviar solicitudes de factura.
Generar consecutivos.
Generar PDFs.
Validar generación de facturas.
Integración con proveedor de email.
Emails

Opciones posibles:

Resend
SendGrid
Postmark
Mailgun

Se recomienda usar un proveedor externo de email desde Supabase Edge Functions.

## 11. Módulos principales de la aplicación
### 11.1 Auth

Funciones:

Login.
Logout.
Recuperar contraseña.
Aceptar invitación.
Crear contraseña inicial.
Redirección según rol.

Rutas sugeridas:

/login
/forgot-password
/accept-invite
11.2 Dashboard Admin

Funciones:

Ver resumen mensual.
Total usuarios activos.
Facturas pendientes.
Facturas generadas.
Facturas pagadas.
Acceso rápido a solicitud masiva de facturas.

Ruta sugerida:

/admin/dashboard
### 11.3 Gestión de usuarios

Funciones:

Listar usuarios.
Invitar usuario.
Editar usuario.
Asignar proyecto.
Configurar modalidad de pago.
Activar/desactivar usuario.

Ruta sugerida:

/admin/users
/admin/users/new
/admin/users/:id
### 11.4 Gestión de proyectos

Funciones:

Crear proyecto.
Editar proyecto.
Desactivar proyecto.
Ver detalle del proyecto con la lista completa de colaboradores asignados (activos e históricos).
Por cada colaborador del proyecto mostrar: nombre, email, modalidad de pago para ese proyecto, tarifa, fecha de inicio/fin, estado.
Asignar nuevos colaboradores al proyecto.
Remover o desactivar colaboradores del proyecto.
Ver tareas y horas registradas por proyecto en el periodo seleccionado.
Ver facturas que incluyen ítems de este proyecto.

Ruta sugerida:

/admin/projects
/admin/projects/:id
/admin/projects/:id/members
### 11.5 Solicitudes de factura

Funciones:

Solicitar factura a un usuario.
Solicitar factura masivamente.
Filtrar por periodo.
Filtrar por proyecto.
Ver estado de cada solicitud.

Ruta sugerida:

/admin/invoice-requests
### 11.6 Facturas Admin

Funciones:

Ver todas las facturas.
Filtrar por usuario.
Filtrar por proyecto (mostrar facturas que contengan ítems de ese proyecto).
Filtrar por mes.
Filtrar por estado.
Descargar PDF.
Aprobar factura.
Rechazar factura.
Marcar como pagada.
Cambiar directamente el número consecutivo de una factura (con motivo).
Ver historial de cambios de consecutivo de una factura.

Ruta sugerida:

/admin/invoices
/admin/invoices/:id
/admin/invoices/:id/change-number

### 11.6.1 Solicitudes de cambio de consecutivo (Admin)

Funciones:

Ver todas las solicitudes de cambio de consecutivo enviadas por usuarios.
Filtrar por estado (pending, approved, rejected, applied).
Ver detalle de la solicitud: factura, número actual, número propuesto, motivo, usuario solicitante.
Aprobar solicitud (aplica el cambio y registra auditoría).
Rechazar solicitud (con notas de rechazo).

Ruta sugerida:

/admin/invoice-number-requests
/admin/invoice-number-requests/:id
### 11.7 Dashboard Usuario

Funciones:

Ver proyecto actual.
Ver modalidad de pago.
Ver estado de factura del mes.
Acceso rápido para registrar tareas.
Acceso rápido para generar factura.

Ruta sugerida:

/app/dashboard
### 11.8 Perfil de facturación

Funciones:

Editar datos personales.
Editar datos fiscales.
Editar datos bancarios.
Definir observaciones por defecto.

Ruta sugerida:

/app/billing-profile
### 11.9 Tareas del usuario

Solo aplica si el usuario tiene pago por hora.

Funciones:

Crear tarea.
Editar tarea.
Eliminar tarea no facturada.
Ver tareas del mes.
Ver total de horas.
Ver tareas ya facturadas.

Ruta sugerida:

/app/tasks
/app/tasks/new
/app/tasks/:id
### 11.10 Facturas Usuario

Funciones:

Ver historial de facturas.
Generar factura mensual unificada (incluye automáticamente todos sus proyectos del periodo).
Ver desglose por proyecto dentro de cada factura.
Agregar observaciones.
Descargar PDF.
Ver estado de revisión/pago.
Solicitar cambio del número consecutivo de una factura (formulario con número propuesto y motivo).
Ver estado de sus solicitudes de cambio de consecutivo (pendiente, aprobada, rechazada).

Ruta sugerida:

/app/invoices
/app/invoices/new
/app/invoices/:id
/app/invoices/:id/request-number-change
/app/invoice-number-requests
## 12. Generación de factura

La factura mensual de un usuario es **única por periodo** y agrupa todos los proyectos en los que participó durante ese mes. Cada proyecto se calcula con su propia modalidad de pago (hourly o fixed) y se incluye como uno o varios `invoice_items` dentro de la misma factura.

### Flujo general

El sistema debe:

1. Tomar el periodo seleccionado (`period_start`, `period_end`).
2. Identificar todos los proyectos activos del usuario en ese periodo (`user_project_assignments` con rangos solapados).
3. Para cada proyecto, leer su `compensation_settings` activa en el periodo.
4. Calcular el subtotal por proyecto según su modalidad (ver fórmulas abajo).
5. Crear un `invoice_item` por cada proyecto (con `project_id` y `payment_type` correspondientes).
6. Sumar los subtotales de todos los proyectos para obtener el subtotal general.
7. Aplicar impuestos si corresponde y obtener el total.
8. Generar el consecutivo del usuario.
9. Crear el registro en `invoices`.
10. Asociar las tareas del periodo a la factura (cuando el proyecto sea hourly).
11. Generar el PDF con el desglose por proyecto.

### Cálculo por proyecto

#### Pago por hora (hourly)

Para los proyectos con `payment_type = hourly`:

- Buscar las tareas del usuario dentro del periodo y filtradas por `project_id`.
- Sumar las horas registradas en ese proyecto.
- Multiplicar por la `hourly_rate` configurada para ese proyecto.

Fórmula:

```
project_subtotal = total_hours_project * hourly_rate_project
```

#### Pago fijo mensual (fixed)

Para los proyectos con `payment_type = fixed`:

- Tomar la `monthly_rate` activa para ese proyecto en el periodo.
- Crear un `invoice_item` con `quantity = 1`.

Fórmula:

```
project_subtotal = monthly_rate_project
```

### Total de la factura

```
subtotal = sum(project_subtotal_i) for i in projects_of_period
total = subtotal + tax_amount
```

### Reglas adicionales

- Si un usuario participa en proyectos con monedas distintas, se debe rechazar la generación o emitir facturas separadas por moneda. Por defecto se exige que todos los proyectos del usuario en el periodo usen la misma moneda.
- Si en el periodo no hay proyectos activos ni tareas registradas, no se permite generar la factura.
- Si un proyecto hourly no tiene tareas en el periodo, se puede omitir o incluir con total 0 (configurable).
## 13. Formato base de factura

El PDF debe incluir el desglose por proyecto cuando el usuario participe en más de uno durante el periodo.

```
INFORMAGE STUDIOS

Invoice Number: INF-RCA-2026-0001
Invoice Date: 2026-03-31
Billing Period: 2026-03-01 to 2026-03-31

From:
[User legal name]
[Tax ID]
[Address]
[City, Country]
[Billing email]

To:
Informage Studios
[Company billing data]

Projects in this invoice:
- [Project A name]
- [Project B name]

Items:
-----------------------------------------------------------------------------
Project        Description                       Qty   Unit Price   Total
-----------------------------------------------------------------------------
Project A      Development tasks (hourly)        60    20 USD       1200 USD
Project B      Monthly fixed compensation        1     800 USD      800 USD
-----------------------------------------------------------------------------

Subtotal by project:
- Project A: 1200 USD
- Project B: 800 USD

Subtotal: 2000 USD
Taxes: 0 USD
Total: 2000 USD

Payment Details:
[Bank or payment information]

Notes:
[User invoice observations]
```

Si el usuario solo participa en un proyecto, el desglose por proyecto se simplifica visualmente, pero el modelo de datos sigue siendo el mismo (un `invoice_item` con `project_id`).

## 14. Reglas de negocio importantes
Un usuario puede tener solo una factura por periodo, sin importar cuántos proyectos incluya, salvo que el admin permita regeneración.
La factura mensual unifica todos los proyectos del usuario en ese periodo.
Una factura generada debe tener consecutivo único dentro de la secuencia del usuario.
Las tareas facturadas no deberían editarse libremente.
Solo usuarios activos pueden generar facturas.
Solo usuarios con perfil de facturación completo pueden generar facturas.
El admin puede rechazar una factura y solicitar corrección.
La generación del consecutivo debe ocurrir en backend.
El admin puede cambiar el consecutivo directamente; el usuario solo puede solicitarlo y requiere aprobación del admin.
Todo cambio de consecutivo debe quedar auditado en `invoice_number_history`.
El usuario no debe poder manipular totales desde frontend.
Los cálculos importantes deben validarse en backend.
El PDF debe generarse desde datos confiables guardados en base de datos.
Cuando se cambia el consecutivo de una factura, el PDF debe regenerarse para reflejar el nuevo número.
El sistema debe guardar historial de facturas.
Los correos enviados deben quedar registrados.

## 15. Primera versión MVP

Para una primera versión, el MVP podría incluir:

Admin
Login.
Crear proyectos.
Invitar usuarios.
Configurar pago del usuario.
Ver usuarios.
Solicitar facturas individualmente.
Solicitar facturas masivamente.
Ver facturas generadas.
Descargar PDFs.
Usuario
Login.
Completar perfil de facturación.
Ver datos de pago.
Registrar tareas si cobra por hora.
Generar factura mensual.
Descargar factura.
Ver historial de facturas.
Backend
Supabase Auth.
Tablas principales.
RLS básico.
Edge Function para generar factura.
Edge Function para enviar correos.
Storage para guardar PDFs.
## 16. Funcionalidades futuras

Posibles mejoras después del MVP:

Aprobación formal de tareas antes de facturar.
Flujo de rechazo y corrección de facturas.
Firma digital.
Integración con sistemas contables.
Exportación a Excel/CSV.
Dashboard financiero por proyecto.
Notificaciones push usando Capacitor.
Recordatorios automáticos mensuales.
Generación automática programada de solicitudes.
Multiempresa.
Soporte para impuestos por país.
Soporte para varias monedas.
Historial de cambios en tarifas.
Comentarios entre admin y usuario por factura.
Adjuntos en facturas.
Plantillas personalizadas de PDF.
Estados avanzados de pago.
Auditoría completa.

## 17. Consideraciones para Capacitor

La app debería desarrollarse primero como aplicación web responsive.

Luego, usando Capacitor, se puede empaquetar para:

iOS
Android
Desktop, si se desea más adelante

Consideraciones:

Mantener UI mobile-first.
Usar componentes responsive.
Evitar dependencias que solo funcionen en navegador.
Manejar bien descargas de PDF en móvil.
Considerar almacenamiento local mínimo.
Las notificaciones push pueden agregarse después del MVP.

## 18. Estructura sugerida del proyecto frontend
src/
  app/
    router/
    providers/
  components/
    ui/
    forms/
    layout/
  features/
    auth/
    admin/
      users/
      projects/
      invoices/
      invoice-requests/
    user/
      dashboard/
      billing-profile/
      tasks/
      invoices/
  lib/
    supabase/
    validations/
    dates/
    currency/
    pdf/
  types/
  hooks/
  pages/

##19. Edge Functions sugeridas
supabase/functions/
  invite-user/
  request-invoice/
  request-invoices-bulk/
  generate-invoice/
  generate-invoice-pdf/
  request-invoice-number-change/
  resolve-invoice-number-change/
  change-invoice-number/
  send-email/
invite-user

Responsable de:

Crear invitación.
Crear usuario o invitar vía Supabase Auth.
Registrar perfil inicial.
Enviar correo de invitación.
request-invoice

Responsable de:

Crear solicitud de factura individual.
Enviar correo al usuario.
Guardar log de email.
request-invoices-bulk

Responsable de:

Buscar usuarios activos.
Crear solicitudes para cada usuario.
Enviar correos masivos.
Registrar logs.
generate-invoice

Responsable de:

Validar usuario.
Validar periodo.
Identificar todos los proyectos activos del usuario en el periodo.
Calcular subtotal por cada proyecto según su modalidad de pago.
Sumar el total de la factura.
Generar consecutivo (único dentro de la secuencia del usuario).
Crear factura.
Crear un invoice item por cada proyecto incluido.
Asociar tareas si aplica (proyectos hourly).
Ejecutar generación de PDF.

generate-invoice-pdf

Responsable de:

Tomar datos de la factura.
Renderizar formato base con desglose por proyecto.
Guardar PDF en Supabase Storage.
Retornar URL del archivo.

request-invoice-number-change

Responsable de:

Recibir invoice_id, número propuesto y motivo.
Validar que el solicitante sea el dueño de la factura (si rol = user) o admin.
Crear registro en `invoice_number_change_requests` con status `pending` (si es user) o ejecutar directamente (si es admin → delegar a `change-invoice-number`).
Notificar al admin por correo cuando la solicitud venga de un usuario.

resolve-invoice-number-change

Responsable de (solo admin):

Aprobar o rechazar una solicitud existente.
Si aprueba: validar unicidad del nuevo número en la secuencia del usuario y delegar a `change-invoice-number`.
Si rechaza: actualizar la solicitud con el motivo y notificar al usuario por correo.

change-invoice-number

Responsable de (solo admin o función interna):

Validar que el nuevo número no exista en la secuencia del usuario.
Actualizar `invoices.invoice_number` y `user_invoice_sequence` si aplica.
Insertar registro en `invoice_number_history`.
Regenerar el PDF con el nuevo número.
Notificar por correo al usuario el resultado.

## 20. Recomendaciones técnicas
Validación

Usar validaciones compartidas con Zod para:

Formularios.
Datos de facturación.
Tareas.
Periodos.
Facturas.
Configuración de pagos.
Estado remoto

Usar TanStack Query para:

Cargar usuarios.
Cargar proyectos.
Cargar tareas.
Cargar facturas.
Invalidar datos luego de crear o editar registros.
Permisos

Centralizar lógica de roles:

role === 'admin'
role === 'user'

Crear helpers como:

isAdmin(user)
isRegularUser(user)
canEditInvoice(user, invoice)
canGenerateInvoice(user, period)
Fechas

Usar periodos mensuales claros:

period_start = primer día del mes
period_end = último día del mes

Ejemplo:

2026-03-01
2026-03-31
Moneda

Guardar moneda en configuración de compensación.

Ejemplos:

USD
COP
EUR

No asumir una moneda global si puede cambiar por usuario.

## 21. Riesgos y puntos importantes
Riesgo: duplicados de factura

Solución:

Constraint único en base de datos por (user_id, period_start, period_end) cuando el status no sea `cancelled`.
Generación de factura mediante función backend transaccional.

Riesgo: manipulación de totales desde frontend

Solución:

El frontend solo solicita generación.
El backend calcula totales usando datos guardados, agregando todos los proyectos del usuario en el periodo.

Riesgo: edición de tareas ya facturadas

Solución:

Bloquear edición si invoice_id no es null.
Permitir cambios solo por admin o mediante flujo de corrección.

Riesgo: consecutivos duplicados

Solución:

Mantener una secuencia por usuario (`user_invoice_sequence`) gestionada en backend.
Constraint único en `(user_id, user_invoice_sequence)` y en `invoice_number`.
No generar consecutivos en frontend.
Validar unicidad antes de aplicar cualquier cambio aprobado.

Riesgo: cambio malicioso de consecutivo por parte del usuario

Solución:

El usuario solo puede *solicitar* el cambio, nunca aplicarlo directamente.
Las solicitudes nacen en `pending` y requieren aprobación del admin.
RLS impide que un usuario modifique `invoices.invoice_number` directamente.
Toda mutación queda en `invoice_number_history`.

Riesgo: facturas con proyectos en monedas distintas

Solución:

Validar en backend que todos los proyectos activos del usuario en el periodo tengan la misma moneda.
En caso contrario, bloquear la generación o exigir generación separada.

Riesgo: acceso indebido a datos

Solución:

Activar RLS en todas las tablas.
Políticas por rol.
Revisar acceso a Storage.

## 22. Prompt inicial para Claude Code
Build a full-stack internal invoice management application for Informage Studios.

Tech stack:
- React.js
- TypeScript
- Supabase Auth
- Supabase PostgreSQL
- Supabase Storage
- Supabase Edge Functions
- Capacitor-ready frontend

The app has two main roles: admin and user.

Admins can invite users, manage projects (including viewing and managing project members), assign users to multiple projects at once, configure payment type per user/project, request invoices, view generated invoices, manage invoice status, change invoice numbers directly, and approve/reject invoice number change requests submitted by users.

Users can complete their billing profile, view all projects they participate in, register tasks if they are hourly workers, and generate a single unified monthly invoice that includes all projects they participated in during the period. Users can also request a change to their invoice consecutive number, which requires admin approval.

Payment types (configured per user/project assignment):
1. Hourly:
   - Users register tasks with name, description, date, hours and observations, linked to a specific project.
   - Subtotal per project is calculated as total hours for that project multiplied by its hourly rate.

2. Fixed monthly:
   - Subtotal per project is the configured monthly rate for that project.

A single monthly invoice can mix items from hourly and fixed projects.

Invoices must include:
- Unique invoice number (per-user sequence, e.g. INF-{USER_CODE}-YYYY-NNNN)
- Invoice date
- Billing period
- User billing information
- Informage Studios billing information
- List of projects included in the invoice
- Per-project breakdown of items (each item references its project_id and payment_type)
- Subtotal per project
- Subtotal total
- Taxes
- Total
- Payment details
- Notes
- PDF file stored in Supabase Storage (regenerated when invoice number changes)

Important requirements:
- Use Supabase Row Level Security.
- Users can only access their own data.
- Admins can access all data.
- Invoice totals must be calculated on the backend, aggregating all projects of the user for the period.
- Invoice numbers must be generated on the backend, with a per-user sequence.
- Prevent duplicate invoices for the same user and period (regardless of how many projects).
- Users cannot directly modify invoice numbers; they can only submit change requests for admin approval.
- Admins can change invoice numbers directly. All changes (direct or via approved request) must be audited in invoice_number_history.
- Tasks linked to invoices should not be editable by regular users.
- A user can be assigned to multiple projects simultaneously, and the project detail view must list all assigned collaborators.
- Create a clean, responsive UI that can later be packaged using Capacitor.

Start by creating:
1. Database schema.
2. RLS policies.
3. Supabase client setup.
4. Auth flow.
5. Admin dashboard.
6. User dashboard.
7. Task management.
8. Invoice generation flow.
9. Edge Function for invoice generation.
10. Basic PDF invoice generation.
23. Entregables esperados

El proyecto debería entregar:

Aplicación web funcional.
Base de datos Supabase configurada.
Políticas RLS.
Autenticación con roles.
Panel admin.
Panel usuario.
Registro de tareas.
Generación de facturas.
Generación de PDF.
Storage de PDFs.
Solicitud de facturas por email.
Historial de facturas.
Código preparado para Capacitor.