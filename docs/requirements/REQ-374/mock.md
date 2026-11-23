# REQ-374: Dealer staff accounts - mock (ASCII)

## Staff list and create/edit (dealer owner)

```
+--------------------------------------------------------------+
|  Staff                                        [ + Add staff ]|
+--------------------------------------------------------------+
|  Name            Role         Email             Phone        |
|  ------------    ----------   ---------------   ----------   |
|  A. Kumar        Salesman     a.kumar@...       98xxxxxx01   |
|  R. Singh        Serviceman   r.singh@...       98xxxxxx02   |
|  (owner)         Owner        (owner account)   --           |
+--------------------------------------------------------------+

+--------------------------- Add / edit staff -----------------+
|  Name      [____________________________]                    |
|  Role      ( ) Salesman   ( ) Serviceman                     |
|  Email     [____________________________]                    |
|  Phone     [____________________________]                    |
|  Password  [____________________________]   (add only)       |
|                                                              |
|                              [ Cancel ]  [ Save ]            |
+--------------------------------------------------------------+
```

Notes:
- Role choices are Salesman and Serviceman only. The Owner row is shown for reference and is not editable or selectable as a staff role.
- Sample names, emails and phone numbers are placeholders.

## Staff sign-in

```
+------------------------------+
|  Sign in                     |
|  Email    [________________] |
|  Password [________________] |
|                  [ Sign in ] |
+------------------------------+

After sign-in (staff user): shows only this dealer's data.
```
