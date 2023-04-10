const AddMessageForm = ({ setDataChanged }) => {

  const handleSubmit = async (event) => {
    event.preventDefault()
    console.log("handleSubmit ran")
    const formData = new FormData(event.target);
    console.log("handleSubmit formData:", formData);
    // const author = formData.get("author");
    // console.log(author);
    // const message = formData.get("message");
    // console.log(message);
    const formData2 = Object.fromEntries(formData.entries())
    console.log("handleSubmit formData2:", formData2);
    try {
      const response = await fetch("http://localhost:4000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData2)
      })
      console.log("handleSubmit response:", response);
      const json = await response.json();
      console.log("handleSubmit json:", json);
      setDataChanged(true);
    } catch (error) {
      console.log("handleSubmit error:", error);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Message:</h2>
      <label htmlFor="author">Author:</label>
      <input
        type="text"
        id="author"
        name="author"
      />
      <label htmlFor="message">Message:</label>
      <input
        type="text"
        id="message"
        name="message"
      />
      <button type="submit">Submit</button>
    </form>
  );
}

export default AddMessageForm;
