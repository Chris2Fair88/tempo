const Preloader = ({ message = "Loading..." }) => {
  return (
    <div className="preloader">
      <div className="circle-preloader"></div>
      <p className="preloader__message">{message}</p>
    </div>
  )
}

export default Preloader
