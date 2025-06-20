import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signUpUser } from '../../api/authApi.js';
import { signupValidation } from '../../utils/validateFormData';

const useSignup = () => {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errors, setErrors] = useState([]);

  const navigate = useNavigate();

  const onSignUp = async () => {
    if (password.trim() !== confirmPassword.trim()) {
      toast.error("Password & confirm password don't match");
      return;
    }

    const userData = { firstName, middleName, lastName, email, userName, password, dob, gender };
    const validationErrors = signupValidation(userData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const res = await signUpUser(userData);
    if (res.status === 201) {
      toast.success("Registered Successfully");
      navigate("/edit-profile");
    }
  };

  useEffect(() => {
    errors.forEach((err) => toast.error(err));
  }, [errors]);

  return {
    formData: {
      firstName, middleName, lastName, email, userName, password,
      confirmPassword, gender, dob, isPasswordVisible
    },
    setFormData: {
      setFirstName, setMiddleName, setLastName, setEmail, setUserName,
      setPassword, setConfirmPassword, setGender, setDob, setIsPasswordVisible
    },
    errors,
    onSignUp
  };
};

export default useSignup;
