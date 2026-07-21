import Card from '../ui/Card.jsx'
import Button from '../ui/Button.jsx'

function AccessRestricted({ title, message, buttonText, onBack }) {
  return (
    <Card className="bg-white rounded-[16px] p-6 border border-[#e5e5e5] text-center">
      <h2 className="text-[20px] font-extrabold text-[#111827]">{title}</h2>
      <p className="text-[14px] text-[#5f6679] mt-2">{message}</p>
      <div className="mt-4">
        <Button onClick={onBack} className="px-4 py-2 rounded-full bg-[#3b82f6] text-white font-extrabold">
          {buttonText}
        </Button>
      </div>
    </Card>
  )
}

export default AccessRestricted
