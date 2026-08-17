import { Button, Result } from "antd";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className='page-card'>
      <Result
        status='404'
        title='404'
        subTitle='The page you are looking for does not exist or may have been moved.'
        extra={
          <Link to='/'>
            <Button type='primary'>Go back home</Button>
          </Link>
        }
      />
    </section>
  );
}

export default NotFound;
