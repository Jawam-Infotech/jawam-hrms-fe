import { useEffect, useState } from 'react'
import Card from '../ui/Card.jsx'
import Button from '../ui/Button.jsx'
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  getDesignations,
  createDesignation,
  updateDesignation,
} from '../../services/employeeService.js'

function MasterData() {
  const [departments, setDepartments] = useState([])
  const [designations, setDesignations] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [departmentName, setDepartmentName] = useState('')
  const [editingDepartment, setEditingDepartment] = useState(null)
  const [isDepartmentSaving, setIsDepartmentSaving] = useState(false)

  const [designationName, setDesignationName] = useState('')
  const [editingDesignation, setEditingDesignation] = useState(null)
  const [isDesignationSaving, setIsDesignationSaving] = useState(false)

  const loadDepartments = async () => {
    try {
      const data = await getDepartments()
      setDepartments(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load departments:', err)
      setError(
        err?.response?.data?.detail ||
          'Failed to load departments.'
      )
    }
  }

  const loadDesignations = async () => {
    try {
      const data = await getDesignations()
      setDesignations(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load designations:', err)
      setError(
        err?.response?.data?.detail ||
          'Failed to load designations.'
      )
    }
  }


useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true)
      setError('')

      await Promise.all([
        loadDepartments(),
        loadDesignations(),
      ])
    } finally {
      setLoading(false)
    }
  }

  loadData()
}, [])

  const resetDepartmentForm = () => {
    setDepartmentName('')
    setEditingDepartment(null)
  }

  const resetDesignationForm = () => {
    setDesignationName('')
    setEditingDesignation(null)
  }

  const handleDepartmentSubmit = async (event) => {
    event.preventDefault()

    const name = departmentName.trim()

    if (!name) {
      setError('Department name is required.')
      return
    }

    try {
      setIsDepartmentSaving(true)
      setError('')
      setSuccess('')

      if (editingDepartment) {
        await updateDepartment(editingDepartment.id, {
          name,
        })

        setSuccess('Department updated successfully.')
      } else {
        await createDepartment({
          name,
        })

        setSuccess('Department created successfully.')
      }

      resetDepartmentForm()
      await loadDepartments()
    } catch (err) {
      console.error('Failed to save department:', err)

      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.name?.[0] ||
          'Failed to save department.'
      )
    } finally {
      setIsDepartmentSaving(false)
    }
  }

  const handleDesignationSubmit = async (event) => {
    event.preventDefault()

    const name = designationName.trim()

    if (!name) {
      setError('Designation name is required.')
      return
    }

    try {
      setIsDesignationSaving(true)
      setError('')
      setSuccess('')

      if (editingDesignation) {
        await updateDesignation(editingDesignation.id, {
          name,
        })

        setSuccess('Designation updated successfully.')
      } else {
        await createDesignation({
          name,
        })

        setSuccess('Designation created successfully.')
      }

      resetDesignationForm()
      await loadDesignations()
    } catch (err) {
      console.error('Failed to save designation:', err)

      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.name?.[0] ||
          'Failed to save designation.'
      )
    } finally {
      setIsDesignationSaving(false)
    }
  }

  const handleDepartmentEdit = (department) => {
    setEditingDepartment(department)
    setDepartmentName(department.name)
    setError('')
    setSuccess('')
  }

  const handleDesignationEdit = (designation) => {
    setEditingDesignation(designation)
    setDesignationName(designation.name)
    setError('')
    setSuccess('')
  }

  const handleDepartmentRetire = async (department) => {
    const confirmed = window.confirm(
      `Are you sure you want to retire "${department.name}"?`
    )

    if (!confirmed) return

    try {
      setError('')
      setSuccess('')

      await updateDepartment(department.id, {
        is_active: false,
      })

      setSuccess('Department retired successfully.')
      await loadDepartments()
    } catch (err) {
      console.error('Failed to retire department:', err)

      setError(
        err?.response?.data?.detail ||
          'Failed to retire department.'
      )
    }
  }

  const handleDesignationRetire = async (designation) => {
    const confirmed = window.confirm(
      `Are you sure you want to retire "${designation.name}"?`
    )

    if (!confirmed) return

    try {
      setError('')
      setSuccess('')

      await updateDesignation(designation.id, {
        is_active: false,
      })

      setSuccess('Designation retired successfully.')
      await loadDesignations()
    } catch (err) {
      console.error('Failed to retire designation:', err)

      setError(
        err?.response?.data?.detail ||
          'Failed to retire designation.'
      )
    }
  }

  return (
    <div className="space-y-6">
      {/* Global Messages */}
      {error && (
        <div className="rounded-[10px] border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-[14px] text-[#b91c1c]">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-[10px] border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3 text-[14px] text-[#166534]">
          {success}
        </div>
      )}

      {/* Departments */}
      <Card className="rounded-[24px] border border-[#e5e5e5] bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-[22px] font-extrabold text-[#111827]">
            Departments
          </h2>

          <p className="mt-1 text-[14px] text-[#5f6679]">
            Create, rename, or retire company departments.
          </p>
        </div>

        <form
          onSubmit={handleDepartmentSubmit}
          className="mb-6 flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="text"
            value={departmentName}
            onChange={(event) =>
              setDepartmentName(event.target.value)
            }
            placeholder="Department name"
            className="h-[48px] flex-1 rounded-[9px] border-2 border-[#dedede] bg-white px-4 text-[#111827] outline-none focus:border-[#3a7be0]"
          />

          <Button
            type="submit"
            disabled={isDepartmentSaving}
            className="h-[48px] rounded-[9px] bg-[#3b82f6] px-6 text-white hover:bg-[#2563eb] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDepartmentSaving
              ? 'Saving...'
              : editingDepartment
                ? 'Update Department'
                : 'Add Department'}
          </Button>

          {editingDepartment && (
            <Button
              type="button"
              onClick={resetDepartmentForm}
              className="h-[48px] rounded-[9px] border border-[#d1d5db] bg-white px-6 text-[#111827] hover:bg-[#f8fafc]"
            >
              Cancel
            </Button>
          )}
        </form>

        {loading ? (
          <p className="py-6 text-center text-[#6b7280]">
            Loading departments...
          </p>
        ) : departments.length === 0 ? (
          <p className="py-6 text-center text-[#6b7280]">
            No departments found.
          </p>
        ) : (
          <div className="divide-y divide-[#e5e7eb]">
            {departments.map((department) => (
              <div
                key={department.id}
                className="flex items-center justify-between gap-4 py-4"
              >
                <div>
                  <p className="font-semibold text-[#111827]">
                    {department.name}
                  </p>

                  <p className="text-[13px] text-[#6b7280]">
                    {department.is_active
                      ? 'Active'
                      : 'Retired'}
                  </p>
                </div>

                {department.is_active && (
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      onClick={() =>
                        handleDepartmentEdit(department)
                      }
                      className="rounded-lg border border-[#d1d5db] bg-white px-4 py-2 text-[13px] text-[#111827] hover:bg-[#f8fafc]"
                    >
                      Edit
                    </Button>

                    <Button
                      type="button"
                      onClick={() =>
                        handleDepartmentRetire(department)
                      }
                      className="rounded-lg border border-[#fecaca] bg-white px-4 py-2 text-[13px] text-[#dc2626] hover:bg-[#fef2f2]"
                    >
                      Retire
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Designations */}
      <Card className="rounded-[24px] border border-[#e5e5e5] bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-[22px] font-extrabold text-[#111827]">
            Designations
          </h2>

          <p className="mt-1 text-[14px] text-[#5f6679]">
            Create, rename, or retire employee designations.
          </p>
        </div>

        <form
          onSubmit={handleDesignationSubmit}
          className="mb-6 flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="text"
            value={designationName}
            onChange={(event) =>
              setDesignationName(event.target.value)
            }
            placeholder="Designation name"
            className="h-[48px] flex-1 rounded-[9px] border-2 border-[#dedede] bg-white px-4 text-[#111827] outline-none focus:border-[#3a7be0]"
          />

          <Button
            type="submit"
            disabled={isDesignationSaving}
            className="h-[48px] rounded-[9px] bg-[#3b82f6] px-6 text-white hover:bg-[#2563eb] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDesignationSaving
              ? 'Saving...'
              : editingDesignation
                ? 'Update Designation'
                : 'Add Designation'}
          </Button>

          {editingDesignation && (
            <Button
              type="button"
              onClick={resetDesignationForm}
              className="h-[48px] rounded-[9px] border border-[#d1d5db] bg-white px-6 text-[#111827] hover:bg-[#f8fafc]"
            >
              Cancel
            </Button>
          )}
        </form>

        {loading ? (
          <p className="py-6 text-center text-[#6b7280]">
            Loading designations...
          </p>
        ) : designations.length === 0 ? (
          <p className="py-6 text-center text-[#6b7280]">
            No designations found.
          </p>
        ) : (
          <div className="divide-y divide-[#e5e7eb]">
            {designations.map((designation) => (
              <div
                key={designation.id}
                className="flex items-center justify-between gap-4 py-4"
              >
                <div>
                  <p className="font-semibold text-[#111827]">
                    {designation.name}
                  </p>

                  <p className="text-[13px] text-[#6b7280]">
                    {designation.is_active
                      ? 'Active'
                      : 'Retired'}
                  </p>
                </div>

                {designation.is_active && (
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      onClick={() =>
                        handleDesignationEdit(designation)
                      }
                      className="rounded-lg border border-[#d1d5db] bg-white px-4 py-2 text-[13px] text-[#111827] hover:bg-[#f8fafc]"
                    >
                      Edit
                    </Button>

                    <Button
                      type="button"
                      onClick={() =>
                        handleDesignationRetire(designation)
                      }
                      className="rounded-lg border border-[#fecaca] bg-white px-4 py-2 text-[13px] text-[#dc2626] hover:bg-[#fef2f2]"
                    >
                      Retire
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

export default MasterData