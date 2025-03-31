import AddCaseForm from '../components/AddCaseForm'; // adjust path if needed

const AddCasePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-center mb-8">Add New Case</h1>
      <AddCaseForm />
    </div>
  );
};

export default AddCasePage;
